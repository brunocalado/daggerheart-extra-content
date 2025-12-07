/**
 * Logic to request rolls (Request Roll) from players.
 * Refined visual style based on Daggerheart theme.
 */
export function activateRequestRoll() {
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
                    const labelInput = html.find('[name="label"]').val().trim();

                    // 1. Construct the Roll Command
                    let command = "[[/dr";
                    let params = [];

                    if (difficulty && difficulty !== "") params.push(`difficulty=${difficulty}`);
                    if (trait && trait !== "") params.push(`trait=${trait}`);
                    if (reaction) params.push("reaction=true");
                    if (advantage) params.push("advantage=true");
                    if (disadvantage) params.push("disadvantage=true");

                    if (params.length > 0) command += " " + params.join(" ");
                    command += "]]";

                    if (labelInput && labelInput !== "") command += `{${labelInput}}`;

                    // 2. Visual Configuration
                    const MESSAGE_TITLE = "Roll Request";
                    const BACKGROUND_IMAGE = "modules/daggerheart-extra-content/assets/chat-messages/skull.webp";
                    const MIN_HEIGHT = "100px";

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
                                ${labelInput || MESSAGE_TITLE}
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

                            <!-- The Command (Rendered as Button) -->
                            <span style="
                                color: #ffffff !important; 
                                font-size: 1.1em; 
                                font-weight: bold; 
                                text-shadow: 0px 0px 8px #000000;
                                position: relative;
                                z-index: 1;
                                font-family: 'Lato', sans-serif;
                                line-height: 1.4;
                                width: 100%;
                            ">
                                ${command}
                            </span>
                        </div>
                    </div>
                    `;

                    // 4. Send Message
                    ChatMessage.create({
                        user: game.user.id,
                        speaker: ChatMessage.getSpeaker(),
                        content: content,
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