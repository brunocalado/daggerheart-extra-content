// VERSION 1.0
const numberOfPCs = 4;

// Simple Rest Dialog Macro for Foundry VTT v13
// Creates a basic dialog with Short Rest and Long Rest buttons
const currentFear = game.settings.get(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear);
(async function() {
    try {
        // Create the dialog
        new Dialog({
            title: "Choose Rest Type",
            content: "<p>What type of rest would you like to take?</p>",
            buttons: {
                shortRest: {
                    label: "Short Rest",
                    callback: async () => {
                        const fear = await rollD4WithDiceSoNice();
                        let newFear;
                        if ( (currentFear+fear)>=12 ) {
                          newFear=12;
                        } else {
                          newFear = currentFear+fear;
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
                            //content: `<strong>The GM earns ${fear} fear.</strong>.`
                        });

                    }
                },
                longRest: {
                    label: "Long Rest", 
                    callback: async () => {
                        let fear = await rollD4WithDiceSoNice();
                        fear = fear + numberOfPCs;
                        let newFear;
                        if (currentFear+fear>=12) {
                          newFear=12;
                        } else {
                          newFear = currentFear+fear;
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
                            //content: `<strong>The GM earns ${fear} fear.</strong>.`
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
})();

async function rollD4WithDiceSoNice() {
  try {
      // Cria o roll de 1d4
      const roll = new Roll("1d4");
      
      // Avalia o roll
      await roll.evaluate();
      
      // Verifica se o Dice So Nice está ativo e rola os dados visuais
      if (game.dice3d) {
          await game.dice3d.showForRoll(roll, game.user, true);
      }
      
      // Retorna o valor total rolado
      return roll.total;
      
  } catch (error) {
      console.error("Erro ao rolar 1d4:", error);
      ui.notifications.error("Erro ao rolar o dado!");
      return null;
  }
}