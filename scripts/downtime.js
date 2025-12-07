/**
 * Lógica para o sistema de Downtime e ganho de Fear pelo GM.
 */

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

export async function activateDowntime() {
    const numberOfPCs = 4;
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
                        if (fear === null) return; // Stop if roll failed

                        let newFear;
                        if ((currentFear + fear) >= 12) {
                            newFear = 12;
                        } else {
                            newFear = currentFear + fear;
                        }
                        await game.settings.set(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear, newFear);
                        
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
                        let fearRoll = await rollD4WithDiceSoNice();
                        if (fearRoll === null) return; // Stop if roll failed

                        let fear = fearRoll + numberOfPCs;
                        let newFear;
                        if (currentFear + fear >= 12) {
                            newFear = 12;
                        } else {
                            newFear = currentFear + fear;
                        }
                        await game.settings.set(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear, newFear);
                        
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