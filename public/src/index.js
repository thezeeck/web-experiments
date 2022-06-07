(() => {
  const canvas = document.querySelector("#canvas");
  const form = document.querySelector("#generateTree");
  const ctx = canvas.getContext("2d");
  const size = canvas.height;
  const dialog = document.querySelector("#loadingDialog");

  const calculateColors = (colorA, colorB) => {
    const STEPS = 5;
    const colorObj = {};
    const darkColor = {
      r: parseInt(`0x${colorA.substring(1,3)}`, 16),
      g: parseInt(`0x${colorA.substring(3,5)}`, 16),
      b: parseInt(`0x${colorA.substring(5)}`, 16),
    }
    const ligthColor = {
      r: parseInt(`0x${colorB.substring(1,3)}`, 16),
      g: parseInt(`0x${colorB.substring(3,5)}`, 16),
      b: parseInt(`0x${colorB.substring(5)}`, 16),
    }
    const step = {
      r: (ligthColor.r - darkColor.r) / (STEPS - 1),
      g: (ligthColor.g - darkColor.g) / (STEPS - 1),
      b: (ligthColor.b - darkColor.b) / (STEPS - 1),
    }
    for (let index = 0; index < STEPS; index++) {
      colorObj[`color${index}`] = `rgb(${
          Math.floor(darkColor.r + (index * step.r))
        }, ${
          Math.floor(darkColor.g + (index * step.g))
        }, ${
          Math.floor(darkColor.b + (index * step.b))
        })`
    }
    return colorObj;
  }

  const handleSubmit = event => {
    event.preventDefault();
    dialog.showModal();
    const fields = event.target.elements;
    setTimeout(() => {
      renderTree({
        x: Number(fields.position.value),
        y: size,
        angle: Number(fields.angle.value) / 10,
        radius: Number(fields.trunk.value),
        realism:  Number(fields.realism.value),
        colors: calculateColors(fields.trunkColor.value, fields.leafColor.value),
      });
      dialog.close();
    }, 0);
  }

  const handleReset = () => {
    ctx.clearRect(0, 0, size, size);
  }

  const renderTree = ({x, y, angle, radius, realism, colors}) => {
    const x2 = x + radius * Math.cos(angle - Math.PI / 2);
    const y2 = y + radius * Math.sin(angle - Math.PI / 2);
  
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = radius / 10;
    if (radius < 3) {
      ctx.strokeStyle = colors.color4;
    } else if (radius < 6) {
      ctx.strokeStyle = colors.color3;
    } else if (radius < 12) {
      ctx.strokeStyle = colors.color2;
    } else if (radius < 40) {
      ctx.strokeStyle = colors.color1;
    } else {
      ctx.strokeStyle = colors.color0;
    }
    ctx.stroke();
    for(let i = 0; i < realism; i++) {
      const newRadius = radius * Math.random(.1, 1);
      if (newRadius > 1) {
        renderTree(
          {
            x: x2,
            y: y2,
            angle: angle + (Math.random() * (Math.PI / 4)) * (Math.random() > 0.5 ? 1 : -1 ),
            radius: radius * Math.random(.1, 1),
            realism,
            colors
          }
        );
      }
    };
  }

  form.addEventListener("submit", handleSubmit);
  form.addEventListener("reset", handleReset)
})()