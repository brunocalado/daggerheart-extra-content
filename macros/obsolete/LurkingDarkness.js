// VERSION 1.0

// Darkness Encounter Table Macro for Foundry VTT v13
// Roll 1d12 and display result based on table
const currentFear = game.settings.get(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear);
async function rollDarknessEncounter() {
    // Roll the 1d12 dice
    const roll = new Roll("1d12");
    await roll.evaluate();
    
    // Show the dice roll with Dice So Nice if available
    if (game.dice3d) {
        await game.dice3d.showForRoll(roll);
    }
    
    // Get the result
    const result = roll.total;
    
    // Define the encounter table
    let encounterText = "";
    let mechanicalEffect = "";
    
    switch(true) {
        case (result >= 1 && result <= 2):
            encounterText = "Describe how something monstrous found them in the dark.";
            mechanicalEffect = "An adversary of the GM's choice initiates conflict.";
            break;
        case (result >= 3 && result <= 5):
            encounterText = "Describe how something terrifying stalks nearby.";
            mechanicalEffect = "You gain 2 Fear.";
            addFear(2);
            break;
        case (result >= 6 && result <= 9):
            encounterText = "Describe how the imposing darkness intensifies.";
            mechanicalEffect = "You gain a Fear.";
            addFear(1);
            break;
        case (result >= 10 && result <= 11):
            encounterText = "Describe how the characters rest undisturbed.";
            mechanicalEffect = "No effect.";
            break;
        case (result === 12):
            encounterText = "Describe how the characters stumble upon a hopeful omen.";
            mechanicalEffect = "Each PC gains a Hope.";
            break;
    }
    
    // Create the chat message
    const chatMessage = `
        <div style="border: 2px solid #444; padding: 10px; border-radius: 5px; background: #1a1a1a; color: #ddd;">
            <h3 style="margin-top: 0; color: #ff6b6b; text-align: center;">
                <i class="fas fa-moon"></i> Darkness Encounter <i class="fas fa-moon"></i>
            </h3>
            <div style="text-align: center; font-size: 18px; margin: 10px 0;">
                <strong>Roll Result: ${result}</strong>
            </div>
            <div style="margin: 10px 0; padding: 8px; background: #2a2a2a; border-left: 4px solid #ff6b6b;">
                <strong>Narrative:</strong> ${encounterText}
            </div>
            <div style="margin: 10px 0; padding: 8px; background: #2a2a2a; border-left: 4px solid #4ecdc4;">
                <strong>Effect:</strong> ${mechanicalEffect}
            </div>
        </div>
    `;
    
    // Send the message to chat
    ChatMessage.create({
        user: game.user.id,
        speaker: {alias: "Darkness Encounter"},
        content: chatMessage,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER
    });
}

// Execute the function
rollDarknessEncounter();

function addFear(fear) {
  let newFear;
  if ( (currentFear+fear)>=12 ) {
    newFear=12;
  } else {
    newFear = currentFear+fear;
  }  
  game.settings.set(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear, newFear);
}