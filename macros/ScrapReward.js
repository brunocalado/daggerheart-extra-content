// VERSION 1.0

// Remnant Loot Generator Macro for Foundry VTT v13
// This macro creates a dialog to select battle difficulty and remnant amount,
// then rolls on the appropriate tables to generate loot

async function remnantLootGenerator() {
    // Define the loot table based on difficulty and remnant amount
    const lootTable = {
        "A few remnants": {
            "Easy Fight": { shards: 2, metals: 0, components: 0 },
            "Standard Fight": { shards: 2, metals: 1, components: 0 },
            "Difficult Fight": { shards: 2, metals: 1, components: 1 },
            "Very Difficult Fight": { shards: 2, metals: 2, components: 1 }
        },
        "Mostly remnants": {
            "Easy Fight": { shards: 2, metals: 1, components: 0 },
            "Standard Fight": { shards: 2, metals: 2, components: 1 },
            "Difficult Fight": { shards: 3, metals: 2, components: 1 },
            "Very Difficult Fight": { shards: 3, metals: 3, components: 2 }
        },
        "All remnants": {
            "Easy Fight": { shards: 2, metals: 1, components: 1 },
            "Standard Fight": { shards: 3, metals: 2, components: 2 },
            "Difficult Fight": { shards: 3, metals: 3, components: 2 },
            "Very Difficult Fight": { shards: 4, metals: 3, components: 3 }
        }
    };

    // Create the dialog HTML
    const dialogContent = `
        <form>
            <div class="form-group">
                <label><strong>Battle Difficulty:</strong></label>
                <select name="difficulty" style="width: 100%; margin-bottom: 10px;">
                    <option value="Easy Fight">Easy Fight</option>
                    <option value="Standard Fight">Standard Fight</option>
                    <option value="Difficult Fight">Difficult Fight</option>
                    <option value="Very Difficult Fight">Very Difficult Fight</option>
                </select>
            </div>
            <div class="form-group">
                <label><strong>Amount of Remnants:</strong></label>
                <select name="remnants" style="width: 100%;">
                    <option value="A few remnants">A few remnants</option>
                    <option value="Mostly remnants">Mostly remnants</option>
                    <option value="All remnants">All remnants</option>
                </select>
            </div>
        </form>
    `;

    // Show the dialog
    new Dialog({
        title: "Remnant Loot Generator",
        content: dialogContent,
        buttons: {
            generate: {
                label: "Generate Loot",
                callback: async (html) => {
                    const difficulty = html.find('[name="difficulty"]').val();
                    const remnants = html.find('[name="remnants"]').val();
                    
                    await generateLoot(difficulty, remnants, lootTable);
                }
            },
            cancel: {
                label: "Cancel"
            }
        },
        default: "generate"
    }).render(true);
}

async function generateLoot(difficulty, remnants, lootTable) {
    try {
        // Get the loot amounts from the table
        const lootAmounts = lootTable[remnants][difficulty];
        
        // Find the compendium tables
        const compendium = game.packs.get("daggerheart-extra-content.motherboard-tables");
        if (!compendium) {
            ui.notifications.error("Compendium 'daggerheart-extra-content.motherboard-tables' not found!");
            return;
        }

        // Load the compendium content
        await compendium.getDocuments();
        
        // Find the tables
        const shardsTable = compendium.contents.find(t => t.name === "Shards");
        const metalsTable = compendium.contents.find(t => t.name === "Metals");
        const componentsTable = compendium.contents.find(t => t.name === "Components");

        if (!shardsTable || !metalsTable || !componentsTable) {
            ui.notifications.error("One or more required tables (Shards, Metals, Components) not found in the compendium!");
            return;
        }

        let results = [];
        let chatMessage = `<h2>🎲 Remnant Loot Results</h2>`;
        chatMessage += `<p><strong>Battle Difficulty:</strong> ${difficulty}</p>`;
        chatMessage += `<p><strong>Amount of Remnants:</strong> ${remnants}</p>`;
        chatMessage += `<hr>`;

        // Roll for Shards
        if (lootAmounts.shards > 0) {
            chatMessage += `<h4>⚡ Shards (${lootAmounts.shards} rolls):</h4>`;
            for (let i = 0; i < lootAmounts.shards; i++) {
                const roll = await shardsTable.roll();
                const result = roll.results[0];
                
                // Create link to the item in compendium
                let itemLink;
                if (result.documentCollection && result.documentId) {
                  itemLink = await result.getHTML();
                }
                
                const temp = await addItemToActor(result);
                
                //results.push(`Shard: ${result.text}`);
                chatMessage += `<p>• ${itemLink}</p>`;
            }
        }

        // Roll for Metals
        if (lootAmounts.metals > 0) {
            chatMessage += `<h4>🔩 Metals (${lootAmounts.metals} rolls):</h4>`;
            for (let i = 0; i < lootAmounts.metals; i++) {
                const roll = await metalsTable.roll();
                const result = roll.results[0];
                
                // Create link to the item in compendium
                let itemLink;
                if (result.documentCollection && result.documentId) {
                  itemLink = await result.getHTML();
                }
                
                const temp = await addItemToActor(result);
                
                //results.push(`Metal: ${result.text}`);
                chatMessage += `<p>• ${itemLink}</p>`;
            }
        }

        // Roll for Components
        if (lootAmounts.components > 0) {
            chatMessage += `<h4>⚙️ Components (${lootAmounts.components} rolls):</h4>`;
            for (let i = 0; i < lootAmounts.components; i++) {
                const roll = await componentsTable.roll();
                const result = roll.results[0];
                console.log('-----------------')
                console.log(result)
                console.log('-----------------')
                // Create link to the item in compendium
                let itemLink;
                if (result.documentCollection && result.documentId) {
                    itemLink = await result.getHTML();
                }
                
                const temp = await addItemToActor(result);
                
                //results.push(`Component: ${result.text}`);
                chatMessage += `<p>• ${itemLink}</p>`;
            }
        }

        // Send the results to chat
        ChatMessage.create({
            user: game.user.id,
            content: chatMessage,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER
        });
      
        ui.notifications.info("Remnant loot generated and posted to chat!");
        
        const temp2 = await removeDuplicatesFromActor(); 
        
    } catch (error) {
        console.error("Error generating remnant loot:", error);
        ui.notifications.error("Error generating loot. Check console for details.");
    }
}

async function addItemToActor(result) {
  const selectedTokens = canvas.tokens.controlled;
  if (selectedTokens.length === 0) {
      ui.notifications.warn("Please select a token first.");
      return;
  }

  if (selectedTokens.length > 1) {
      ui.notifications.warn("Please select only one token.");
      return;
  }

  const selectedToken = selectedTokens[0];
  const targetActor = selectedToken.actor;

  if (!targetActor) {
      ui.notifications.error("Selected token has no associated actor.");
      return;
  }  

  const item = await fromUuid(result.documentUuid);
  await Item.implementation.create(game.items.fromCompendium(item), {parent: selectedToken.actor});  
}

async function removeDuplicatesFromActor() {
  // Check if a token is selected
  if (!canvas.tokens.controlled.length) {
      ui.notifications.warn("Please select a token first.");
      return;
  }

  // Get the selected token's actor
  const token = canvas.tokens.controlled[0];
  const actor = token.actor;

  if (!actor) {
      ui.notifications.error("Selected token has no associated actor.");
      return;
  }

  // List of target item names
  const targetItems = [
      "Battery", "Capacitor", "Circuit", "Disc", "Fuse", "Relay",
      "Aluminum", "Cobalt", "Copper", "Gold", "Platinum", "Silver",
      "Coil", "Crystal", "Gear", "Lens", "Trigger", "Wire"
  ];

  // Find all loot items that match the target names
  const lootItems = actor.items.filter(item => 
      item.type === "loot" && targetItems.includes(item.name)
  );

  if (lootItems.length === 0) {
      ui.notifications.info("No matching loot items found on this actor.");
      return;
  }

  // Group items by name and sum quantities
  const groupedItems = {};
  const itemsToDelete = [];

  for (const item of lootItems) {
      const itemName = item.name;
      const quantity = item.system.quantity || 1;

      if (!groupedItems[itemName]) {
          // First item of this type - keep it as the base
          groupedItems[itemName] = {
              item: item,
              totalQuantity: quantity,
              duplicates: []
          };
      } else {
          // Additional item of same type - add to total and mark for deletion
          groupedItems[itemName].totalQuantity += quantity;
          groupedItems[itemName].duplicates.push(item);
          itemsToDelete.push(item.id);
      }
  }

  // Update quantities and delete duplicates
  const updates = [];
  let consolidatedCount = 0;

  for (const [itemName, data] of Object.entries(groupedItems)) {
      if (data.duplicates.length > 0) {
          // Update the quantity of the base item
          updates.push({
              _id: data.item.id,
              "system.quantity": data.totalQuantity
          });
          
          consolidatedCount += data.duplicates.length;
          
          console.log(`Consolidating ${itemName}: ${data.duplicates.length + 1} items → 1 item with quantity ${data.totalQuantity}`);
      }
  }

  try {
      // Delete duplicate items
      if (itemsToDelete.length > 0) {
          await actor.deleteEmbeddedDocuments("Item", itemsToDelete);
      }

      // Update quantities of remaining items
      if (updates.length > 0) {
          await actor.updateEmbeddedDocuments("Item", updates);
      }

      // Show success message
      if (consolidatedCount > 0) {
          ui.notifications.info(`Successfully consolidated ${consolidatedCount} duplicate loot items.`);
      } else {
          ui.notifications.info("No duplicate items found to consolidate.");
      }

      // Optional: Show detailed results in chat
      let chatMessage = `<h3>Loot Consolidation Results</h3>`;
      chatMessage += `<p><strong>Actor:</strong> ${actor.name}</p>`;
      
      if (consolidatedCount > 0) {
          chatMessage += `<p><strong>Items consolidated:</strong></p><ul>`;
          for (const [itemName, data] of Object.entries(groupedItems)) {
              if (data.duplicates.length > 0) {
                  chatMessage += `<li>${itemName}: ${data.duplicates.length + 1} items → 1 item (Quantity: ${data.totalQuantity})</li>`;
              }
          }
          chatMessage += `</ul>`;
      } else {
          chatMessage += `<p>No duplicate items were found to consolidate.</p>`;
      }
      
      console.log(chatMessage)
      /*
      ChatMessage.create({
          user: game.user.id,
          content: chatMessage
      });
      */
  } catch (error) {
      console.error("Error consolidating loot items:", error);
      ui.notifications.error("An error occurred while consolidating items. Check the console for details.");
  }  
}

// Execute the macro
const temp1 = await remnantLootGenerator();
