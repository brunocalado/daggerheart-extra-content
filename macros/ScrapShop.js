// VERSION 1.0

(async () => {
  // --- CONFIGURATION ---
  const FOLDER_NAME = "Scrap Shop";
  const CURRENCY_NAME = "quantum"; // Change "credits" to your desired currency name.

  // Price list for all items. For items with multiple listings, the first price is used.
  const itemPrices = {
    // Shards
    "Gear": 1, "Coil": 2, "Wire": 3, "Trigger": 4, "Lens": 5, "Crystal": 6,
    // Metals
    "Aluminum": 1, "Copper": 3, "Cobalt": 5, "Silver": 6, "Platinum": 7, "Gold": 8,
    // Components
    "Fuse": 1, "Circuit": 3, "Disc": 6, "Relay": 8, "Capacitor": 9, "Battery": 10
  };

  // Define the pools of items. Duplicates increase the chance of being rolled.
  const itemPools = {
    shards: {
      roll: '1d10',
      items: ["Gear", "Coil", "Wire", "Trigger", "Lens", "Crystal"]
    },
    metals: {
      roll: '1d8',
      items: ["Aluminum", "Aluminum", "Copper", "Copper", "Cobalt", "Silver", "Platinum", "Gold"]
    },
    components: {
      roll: '1d6',
      items: ["Fuse", "Fuse", "Circuit", "Circuit", "Circuit", "Disc", "Disc", "Relay", "Capacitor", "Battery"]
    }
  };

  // --- FOLDER MANAGEMENT ---
  const getOrCreateFolder = async (folderName, type) => {
    let folder = game.folders.find(f => f.name === folderName && f.type === type);
    if (!folder) {
      try {
        folder = await Folder.create({ name: folderName, type: type, parent: null });
        ui.notifications.info(`Folder "${folderName}" created.`);
      } catch (err) {
        ui.notifications.error(`Could not create folder "${folderName}".`);
        console.error("Folder creation failed:", err);
        return null;
      }
    }
    return folder;
  };

  // --- PROCESSING ---
  let htmlContent = "<h1>Items Available for Purchase</h1>";

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const processCategory = async (categoryName, config) => {
    const qtyRoll = await new Roll(config.roll).evaluate({ async: true });
    const quantity = qtyRoll.total;

    const generatedItems = [];
    for (let i = 0; i < quantity; i++) {
      generatedItems.push(getRandomItem(config.items));
    }

    const itemCounts = generatedItems.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    let categoryHtml = `<h2>${categoryName} (Rolled ${quantity})</h2>`;
    if (Object.keys(itemCounts).length > 0) {
      categoryHtml += "<ul>";
      // Sort items alphabetically
      for (const [item, count] of Object.entries(itemCounts).sort()) {
        const price = itemPrices[item] || 'N/A';
        categoryHtml += `<li>${item} (${count}) - <strong>${price} ${CURRENCY_NAME} each</strong></li>`;
      }
      categoryHtml += "</ul>";
    } else {
      categoryHtml += "<p>None available.</p>";
    }
    return categoryHtml;
  };

  htmlContent += await processCategory("Shards", itemPools.shards);
  htmlContent += await processCategory("Metals", itemPools.metals);
  htmlContent += await processCategory("Components", itemPools.components);

  // --- JOURNAL CREATION ---
  try {
    const folder = await getOrCreateFolder(FOLDER_NAME, "JournalEntry");
    if (!folder) return;

    const journalName = `Shop Inventory - ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
    const journal = await JournalEntry.create({
      name: journalName,
      folder: folder.id,
      pages: [{
        name: "Available Stock",
        type: "text",
        text: {
          content: htmlContent,
          format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML
        }
      }]
    });

    // Open the newly created journal sheet
    journal.sheet.render(true);

  } catch (err) {
    ui.notifications.error("Failed to create Journal Entry. See console (F12) for details.");
    console.error("Error creating shop journal:", err);
  }

})();