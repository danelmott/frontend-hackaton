export const getInitials = (name) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/) // Cambiado de \S a \s para separar por espacios en blanco
      .slice(0, 2)
      .filter(w => w.length > 0)
      .map(w => w[0].toUpperCase())
      .join('');
}

const hashStr = (str) => {
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    
    return hash;
}

export const getAvatarGradient = (name) => {
    const palettes = [
    ['#7F77DD', '#C084FC'],
    ['#1D9E75', '#5DCAA5'],
    ['#D85A30', '#FBBF72'],
    ['#D4537E', '#F9A8C9'],
    ['#378ADD', '#7DD3FC'],
    ['#639922', '#BEF264'],
    ['#BA7517', '#FCD34D'],
    ['#E24B4A', '#FCA5A5'],
    ['#534AB7', '#818CF8'],
    ['#0F6E56', '#2DD4BF'],
    ];
    const hash = hashStr(name.toLowerCase().trim());
    const angle = (hash % 12) * 30;
    const palette = palettes[hash % palettes.length];
    return `linear-gradient(${angle}deg, ${palette[0]}, ${palette[1]})`;
}