document.addEventListener("DOMContentLoaded", function () {
    const rootStyles = getComputedStyle(document.documentElement);
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);

    let cssContent = "";

    // Fonction pour ajuster la luminosité d'une couleur HEX
    function adjustBrightness(hex, percent) {
        hex = hex.replace(/^#/, '');
        let num = parseInt(hex, 16);
        let r = (num >> 16) + percent;
        let g = ((num >> 8) & 0x00FF) + percent;
        let b = (num & 0x0000FF) + percent;

        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        return `rgb(${r}, ${g}, ${b})`;
    }

    // Récupérer toutes les variables CSS définies dans `:root`
    for (let i = 0; i < document.styleSheets.length; i++) {
        try {
            let rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
            for (let rule of rules) {
                if (rule.selectorText === ":root") {
                    for (let prop of rule.style) {
                        if (prop.startsWith("--")) {
                            let colorName = prop.replace("--", "").trim();
                            let colorValue = rootStyles.getPropertyValue(prop).trim();

                            if (colorValue) {
                                cssContent += `
                                    .SD-text-color-${colorName} { color: ${colorValue} !important; }
                                    .SD-bg-color-${colorName} { background-color: ${colorValue} !important; }

                                    /* Transparent */
                                    .SD-text-color-${colorName}-transparent { color: ${colorValue}80 !important; }
                                    .SD-bg-color-${colorName}-transparent { background-color: ${colorValue}80 !important; }

                                    /* Light & Dark */
                                    .SD-text-color-${colorName}-light { color: ${adjustBrightness(colorValue, 40)} !important; }
                                    .SD-bg-color-${colorName}-light { background-color: ${adjustBrightness(colorValue, 40)} !important; }

                                    .SD-text-color-${colorName}-dark { color: ${adjustBrightness(colorValue, -40)} !important; }
                                    .SD-bg-color-${colorName}-dark { background-color: ${adjustBrightness(colorValue, -40)} !important; }
                                `;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.warn("Impossible d'accéder aux styles CSS pour récupérer les variables de :root", error);
        }
    }

    // Ajouter les styles au document
    styleSheet.innerHTML = cssContent;
});
