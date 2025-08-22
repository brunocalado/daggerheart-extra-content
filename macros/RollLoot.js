/*
 * MACRO FOR FOUNDRY VTT v13
 * --------------------------
 * Description: Reads a compendium of tables, filters for those containing "Consumable"
 * in their name, sorts the list alphabetically, and presents a dialog for the
 * user to select which table to roll.
 */

(async () => {
  // --- CONFIGURATION ---
  const compendiumName = "daggerheart-extra-content.loot-and-consumable-tables";
  const filterKeyword = "Loot";
  // ---------------------

  // 1. Access the compendium
  const pack = game.packs.get(compendiumName);
  if (!pack) {
    ui.notifications.error(`Compendium "${compendiumName}" not found. Please check if the name is correct and the module is active.`);
    return;
  }

  // 2. Load all documents (tables) from the compendium
  const tables = await pack.getDocuments();

  // 3. Filter the tables by name and sort them alphabetically
  const consumableTables = tables
    .filter(table => table.name.includes(filterKeyword))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Check if any tables were found
  if (consumableTables.length === 0) {
    ui.notifications.warn(`No tables containing the word "${filterKeyword}" were found in the compendium "${compendiumName}".`);
    return;
  }

  // 4. Prepare the options for the selection menu
  let options = "";
  for (const table of consumableTables) {
    options += `<option value="${table.id}">${table.name}</option>`;
  }

  // 5. Create the HTML content for the dialog window
  const content = `
    <form>
      <div class="form-group">
        <label>Select a loot table to roll:</label>
        <select id="table-select" style="width: 100%;">
          ${options}
        </select>
      </div>
    </form>
  `;

  // 6. Display the dialog window and await user interaction
  new Dialog({
    title: "Roll Loot Table",
    content: content,
    buttons: {
      roll: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Roll",
        callback: async (html) => {
          const selectedTableId = html.find('#table-select').val();
          const selectedTable = consumableTables.find(t => t.id === selectedTableId);
          if (selectedTable) {
            // 7. Roll the selected table and send the result to the chat
            await selectedTable.draw();
          }
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel"
      }
    },
    default: "roll"
  }).render(true);

})();