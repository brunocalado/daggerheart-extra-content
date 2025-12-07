/**
 * Logic for Falling and Collision Damage calculation.
 * Refined visual style based on Daggerheart theme.
 */
export async function activateFallingDamage() {
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

                    // 1. Evaluate Roll
                    let roll = new Roll(damageFormula);
                    await roll.evaluate();

                    // 2. Visual Configuration
                    const MESSAGE_TITLE = "The Fall Ends";
                    const BACKGROUND_IMAGE = "modules/daggerheart-extra-content/assets/chat-messages/skull.webp";
                    const MIN_HEIGHT = "150px";

                    // 3. HTML Construction
                    const content = `
                    <div class="chat-card" style="border: 2px solid #C9A060; border-radius: 8px; overflow: hidden;">
                        
                        <!-- Header -->
                        <header class="card-header flexrow" style="
                            background: #191919 !important; 
                            padding: 8px; 
                            border-bottom: 2px solid #C9A060;
                        ">
                            <h3 class="noborder" style="
                                margin: 0; 
                                font-weight: bold; 
                                color: #C9A060 !important; 
                                font-family: 'Aleo', serif; 
                                text-align: center;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                width: 100%;
                            ">
                                ${MESSAGE_TITLE}
                            </h3>
                        </header>
                        
                        <!-- Content Body -->
                        <div class="card-content" style="
                            background-image: url('${BACKGROUND_IMAGE}'); 
                            background-repeat: no-repeat; 
                            background-position: center; 
                            background-size: cover; 
                            padding: 20px; 
                            min-height: ${MIN_HEIGHT};
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            position: relative;
                        ">
                            <!-- Overlay -->
                            <div style="
                                position: absolute;
                                top: 0; left: 0; right: 0; bottom: 0;
                                background: rgba(0, 0, 0, 0.6);
                                z-index: 0;
                            "></div>

                            <!-- The Text Info -->
                            <div style="position: relative; z-index: 1; width: 100%;">
                                <div style="
                                    color: #C9A060; 
                                    font-size: 1.1em; 
                                    margin-bottom: 5px;
                                    text-transform: uppercase;
                                    font-family: 'Aleo', serif;
                                ">
                                    ${heightText}
                                </div>
                                <div style="
                                    color: #ccc; 
                                    font-size: 0.9em; 
                                    margin-bottom: 15px; 
                                    font-style: italic;
                                ">
                                    ${damageType} (${damageFormula})
                                </div>
                                <div style="
                                    color: #ffffff !important; 
                                    font-size: 2.5em; 
                                    font-weight: bold; 
                                    text-shadow: 0px 0px 10px #ff0000;
                                    font-family: 'Lato', sans-serif;
                                ">
                                    ${roll.total}
                                </div>
                                <div style="color: #eee; font-size: 0.8em; margin-top: 5px;">
                                    DAMAGE
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    // 4. Send Message (using roll.toMessage for proper roll metadata linkage)
                    await roll.toMessage({
                        speaker: ChatMessage.getSpeaker(),
                        flavor: `<strong>${heightText}</strong>`, // Fallback flavor
                        content: content
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