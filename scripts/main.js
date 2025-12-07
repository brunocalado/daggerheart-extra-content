import { activateDowntime } from "./downtime.js";
import { activateFallingDamage } from "./falling.js";
import { activateRequestRoll } from "./requestRoll.js";

/**
 * Módulo principal Daggerheart Extra Content
 * Hook para injetar botões no menu do Daggerheart.
 */
Hooks.on("renderDaggerheartMenu", (app, element, data) => {
    
    // ==================================================================
    // CRIAÇÃO DOS BOTÕES
    // ==================================================================

    // Estilo comum para os botões
    const btnStyle = "width: 100%; margin-top: 5px; display: flex; align-items: center; justify-content: center; gap: 5px;";

    // Botão 1: Earn Fear from Downtime
    const btnDowntime = document.createElement("button");
    btnDowntime.type = "button";
    btnDowntime.innerHTML = `<i class="fas fa-bed"></i> Earn Fear (Downtime)`;
    btnDowntime.classList.add("dh-custom-btn");
    btnDowntime.style.cssText = btnStyle;
    btnDowntime.onclick = activateDowntime; // Função importada

    // Botão 2: Falling And Collision Damage
    const btnFalling = document.createElement("button");
    btnFalling.type = "button";
    btnFalling.innerHTML = `<i class="fas fa-skull-crossbones"></i> Falling Damage`;
    btnFalling.classList.add("dh-custom-btn");
    btnFalling.style.cssText = btnStyle;
    btnFalling.onclick = activateFallingDamage; // Função importada

    // Botão 3: Request Roll
    const btnRoll = document.createElement("button");
    btnRoll.type = "button";
    btnRoll.innerHTML = `<i class="fas fa-dice-d20"></i> Request Roll`;
    btnRoll.classList.add("dh-custom-btn");
    btnRoll.style.cssText = btnStyle;
    btnRoll.onclick = activateRequestRoll; // Função importada


    // ==================================================================
    // INSERÇÃO NO DOM (Sidebar)
    // ==================================================================

    const fieldset = element.querySelector("fieldset");

    if (fieldset) {
        // Create a new fieldset container for these GM tools
        const newFieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.innerText = "Extra Content";

        newFieldset.appendChild(legend);
        newFieldset.appendChild(btnDowntime);
        newFieldset.appendChild(btnFalling);
        newFieldset.appendChild(btnRoll);

        // Insert after the original fieldset
        fieldset.after(newFieldset);
    } else {
        // Fallback
        element.appendChild(btnDowntime);
        element.appendChild(btnFalling);
        element.appendChild(btnRoll);
    }
});