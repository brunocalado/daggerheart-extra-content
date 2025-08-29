// Set light range
const bright = 15;
const dim = 30;

// =================================
const TORCH_ICON = 'icons/sundries/lights/torch-brown-lit.webp';
const torchAnimation = {
    "intensity": 3,
    "speed": 3,
    "type": "torch"
};

const torchLight = {
    "alpha": 0.2,
    "angle": 360,
    "animation": torchAnimation,
    "color": "#85501e",
    "luminosity": 0.6,
    "bright": bright,
    "dim": dim 
};

async function toggleTorchLight() {
    if (canvas.tokens.controlled.length === 0) {
        return ui.notifications.error("Nenhum token selecionado!");
    }

    for (const token of canvas.tokens.controlled) {
        const currentLight = token.document.light;
        const isTorchActive = currentLight.animation.type === "torch";

        if (isTorchActive) {
            await token.document.update({
                light: { "bright": 0, "dim": 0, "animation": { "type": "none" }, "color": null }
            });
            await token.toggleEffect(TORCH_ICON, { active: false });
            ui.notifications.info("Luz da tocha desativada.");
        } else {
            await token.document.update({ light: torchLight });
            await token.toggleEffect(TORCH_ICON, { active: true });
            ui.notifications.info("Luz da tocha ativada.");
        }
    }
}

toggleTorchLight();