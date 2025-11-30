Hooks.on("renderDaggerheartMenu", (app, element, data) => {
    
    // ==================================================================
    // 1. DEFINIÇÃO DAS FUNÇÕES (Lógica dos arquivos anexados)
    // ==================================================================

    // --- Lógica do Arquivo: Downtime.js ---
    async function activateDowntime() {
        const numberOfPCs = 4;
        
        // Helper function for Dice So Nice
        async function rollD4WithDiceSoNice() {
            try {
                const roll = new Roll("1d4");
                await roll.evaluate();
                if (game.dice3d) {
                    await game.dice3d.showForRoll(roll, game.user, true);
                }
                return roll.total;
            } catch (error) {
                console.error("Erro ao rolar 1d4:", error);
                ui.notifications.error("Erro ao rolar o dado!");
                return null;
            }
        }

        const currentFear = game.settings.get(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear);

        try {
            new Dialog({
                title: "Choose Rest Type",
                content: "<p>What type of rest would you like to take?</p>",
                buttons: {
                    shortRest: {
                        label: "Short Rest",
                        callback: async () => {
                            const fear = await rollD4WithDiceSoNice();
                            let newFear;
                            if ((currentFear + fear) >= 12) {
                                newFear = 12;
                            } else {
                                newFear = currentFear + fear;
                            }
                            game.settings.set(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear, newFear);
                            await ChatMessage.create({
                                user: game.user.id,
                                content: `
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <img src="icons/magic/death/projectile-skull-fire-purple.webp" 
                                             alt="Fear Icon" 
                                             style="width: 32px; height: 32px; border: none;">
                                        <strong>The GM earns ${fear} fear.</strong>
                                    </div>
                                `
                            });
                        }
                    },
                    longRest: {
                        label: "Long Rest",
                        callback: async () => {
                            let fear = await rollD4WithDiceSoNice();
                            fear = fear + numberOfPCs;
                            let newFear;
                            if (currentFear + fear >= 12) {
                                newFear = 12;
                            } else {
                                newFear = currentFear + fear;
                            }
                            game.settings.set(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear, newFear);
                            await ChatMessage.create({
                                user: game.user.id,
                                content: `
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <img src="icons/magic/death/projectile-skull-fire-purple.webp" 
                                             alt="Fear Icon" 
                                             style="width: 32px; height: 32px; border: none;">
                                        <strong>The GM earns ${fear} fear.</strong>
                                    </div>
                                `
                            });
                        }
                    }
                },
                default: "shortRest"
            }).render(true);

        } catch (error) {
            console.error("Error executing Rest Dialog macro:", error);
            ui.notifications.error(`Error: ${error.message}`);
        }
    }

    // --- Lógica do Arquivo: FallingAndCollisionDamage.js ---
    async function activateFallingDamage() {
        let dialogContent = `
          <form>
            <div class="form-group">
              <label>Select Fall Height:</label>
              <select id="fall-height" style="width: 100%; padding: 5px; margin-top: 5px;">
                <option value="veryclose">Very Close (1d10+3)</option>
                <option value="close">Close (1d20+5)</option>
                <option value="far">Far/Very Far (1d100+15)</option>
                <option value="collision">Collision (1d20+5)</option>
              </select>
            </div>
          </form>
        `;

        new Dialog({
            title: "Falling & Collision Damage",
            content: dialogContent,
            buttons: {
                roll: {
                    icon: '<i class="fas fa-dice"></i>',
                    label: "Roll Damage",
                    callback: async (html) => {
                        const selection = html.find("#fall-height").val();
                        let damageFormula = "";
                        let heightText = "";
                        let damageType = "Physical Damage";

                        switch (selection) {
                            case "veryclose":
                                damageFormula = "1d10+3";
                                heightText = "Very Close Range";
                                break;
                            case "close":
                                damageFormula = "1d20+5";
                                heightText = "Close Range";
                                break;
                            case "far":
                                damageFormula = "1d100+15";
                                heightText = "Far/Very Far Range";
                                break;
                            case "collision":
                                damageFormula = "1d20+5";
                                heightText = "Collision";
                                damageType = "Direct Physical Damage";
                                break;
                        }

                        let roll = new Roll(damageFormula);
                        await roll.evaluate();

                        let chatContent = `
                          <div class="daggerheart-falling-damage">
                            <h3 style="color: red;">Falling & Collision Damage</h3>
                            <p><strong>Height/Type:</strong> ${heightText}</p>
                            <p><strong>Damage Type:</strong> ${damageType}</p>
                            <p><strong>Formula:</strong> ${damageFormula}</p>
                            <hr>
                            <p><strong>Total Damage:</strong> ${roll.total}</p>
                          </div>
                        `;

                        await roll.toMessage({
                            speaker: ChatMessage.getSpeaker(),
                            flavor: `<strong>${heightText} - ${damageType}</strong>`,
                            content: chatContent
                        });
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel"
                }
            },
            default: "roll"
        }).render(true);
    }

    // --- Lógica do Arquivo: RequestRoll.js ---
    function activateRequestRoll() {
        new Dialog({
            title: "Roll Configuration",
            content: `
            <form>
              <div class="form-group">
                <label for="difficulty">Difficulty:</label>
                <input type="number" id="difficulty" name="difficulty" min="1" value="15" style="width: 100%;">
              </div>
              
              <div class="form-group">
                <label for="trait">Trait:</label>
                <select id="trait" name="trait" style="width: 100%;">
                  <option value="">-- Select --</option>
                  <option value="strength">Strength</option>
                  <option value="agility">Agility</option>
                  <option value="finesse">Finesse</option>
                  <option value="instinct">Instinct</option>
                  <option value="knowledge">Knowledge</option>
                  <option value="presence">Presence</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>
                  <input type="checkbox" id="reaction" name="reaction"> Reaction
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input type="checkbox" id="advantage" name="advantage"> Advantage
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input type="checkbox" id="disadvantage" name="disadvantage"> Disadvantage
                </label>
              </div>
              
              <div class="form-group">
                <label for="label">Label/Description:</label>
                <input type="text" id="label" name="label" placeholder="Optional..." style="width: 100%;">
              </div>
            </form>
          `,
            buttons: {
                roll: {
                    icon: '<i class="fas fa-dice-d20"></i>',
                    label: "Request Roll",
                    callback: (html) => {
                        const difficulty = html.find('[name="difficulty"]').val();
                        const trait = html.find('[name="trait"]').val();
                        const reaction = html.find('[name="reaction"]').is(':checked');
                        const advantage = html.find('[name="advantage"]').is(':checked');
                        const disadvantage = html.find('[name="disadvantage"]').is(':checked');
                        const label = html.find('[name="label"]').val().trim();

                        let command = "[[/dr";
                        let params = [];

                        if (difficulty && difficulty !== "") params.push(`difficulty=${difficulty}`);
                        if (trait && trait !== "") params.push(`trait=${trait}`);
                        if (reaction) params.push("reaction=true");
                        if (advantage) params.push("advantage=true");
                        if (disadvantage) params.push("disadvantage=true");

                        if (params.length > 0) command += " " + params.join(" ");
                        command += "]]";

                        if (label && label !== "") command += `{${label}}`;

                        ChatMessage.create({
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker(),
                            content: command,
                            type: CONST.CHAT_MESSAGE_TYPES.OTHER
                        });
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel"
                }
            },
            default: "roll",
            close: () => {}
        }, {
            width: 400,
            height: "auto"
        }).render(true);
    }


    // ==================================================================
    // 2. CRIAÇÃO DOS BOTÕES
    // ==================================================================

    // Estilo comum para os botões (opcional, baseado no seu exemplo)
    const btnStyle = "width: 100%; margin-top: 5px; display: flex; align-items: center; justify-content: center; gap: 5px;";

    // Botão 1: Earn Fear from Downtime
    const btnDowntime = document.createElement("button");
    btnDowntime.type = "button";
    btnDowntime.innerHTML = `<i class="fas fa-bed"></i> Earn Fear (Downtime)`;
    btnDowntime.classList.add("dh-custom-btn");
    btnDowntime.style.cssText = btnStyle;
    btnDowntime.onclick = activateDowntime;

    // Botão 2: Falling And Collision Damage
    const btnFalling = document.createElement("button");
    btnFalling.type = "button";
    btnFalling.innerHTML = `<i class="fas fa-skull-crossbones"></i> Falling Damage`;
    btnFalling.classList.add("dh-custom-btn");
    btnFalling.style.cssText = btnStyle;
    btnFalling.onclick = activateFallingDamage;

    // Botão 3: Request Roll
    const btnRoll = document.createElement("button");
    btnRoll.type = "button";
    btnRoll.innerHTML = `<i class="fas fa-dice-d20"></i> Request Roll`;
    btnRoll.classList.add("dh-custom-btn");
    btnRoll.style.cssText = btnStyle;
    btnRoll.onclick = activateRequestRoll;


    // ==================================================================
    // 3. INSERÇÃO NO DOM (Sidebar)
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