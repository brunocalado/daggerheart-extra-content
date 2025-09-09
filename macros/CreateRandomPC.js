// VERSION: 1.2

// Macro to create actor 
// Configure these variables to customize your actor

// ===== CONFIGURATION VARIABLES =====
const actorName = "New Character";                // Actor name
const actorImage = "icons/svg/mystery-man.svg";   // Actor image path or URL
const actorType = "character";                    // Actor type: "character"
const folderName = "My Characters";               // Folder name to organize the actor

// ===== MAIN FUNCTION =====
async function createActor() {
    try {
        // Find or create the folder
        let folder = game.folders.find(f => f.name === folderName && f.type === "Actor");
        
        if (!folder) {
            console.log(`Folder "${folderName}" not found. Creating new folder.`);
            folder = await Folder.create({
                name: folderName,
                type: "Actor",
                parent: null,
                sort: 0
            });
            ui.notifications.info(`Created new folder: "${folderName}"`);
        } else {
            console.log(`Using existing folder: "${folderName}"`);
        }

        // Configure actor data
        const actorData = {
            name: actorName,
            type: actorType,
            img: actorImage,
            folder: folder.id     // Assign to the folder
        };

        // Create the actor
        const actor = await Actor.create(actorData);
        
        if (actor) {
            let itemData;
            ui.notifications.info(`Actor "${actorName}" created successfully in folder "${folderName}"!`);
            console.log(`Created actor: ${actor.name} (ID: ${actor.id})`);
            
            const ancestry = await getRandomAncestry();
            itemData = ancestry.toObject();
            await actor.createEmbeddedDocuments("Item", [itemData]);

            const community = await getRandomCommunity();
            itemData = community.toObject();
            await actor.createEmbeddedDocuments("Item", [itemData]);

            const randomClass = await getRandomClass();
            console.log('===class', randomClass)
            itemData = randomClass.toObject();
            await actor.createEmbeddedDocuments("Item", [itemData]);            

            const subClass = await getRandomSubClass(randomClass.toObject()); // should work           
                    //const tempItem = await Item.create(subClass.toObject(), {temporary: true});
        //await actor.createEmbeddedDocuments("Item", [tempItem.toObject()]);
const tempitemData = (await fromUuid(subClass.uuid)).toObject();
await actor.createEmbeddedDocuments("Item", [tempitemData]);
            //const tempitemData = await fromUuid(subClass.uuid); // also should work
            //console.log('===subclass', tempitemData)
            itemData = subClass;
                    //delete itemData._id;

           //await actor.createEmbeddedDocuments("Item", [itemData]);            

            //actor = updateTraits(actor, randomClass);
            const updateTraits = {
                "system.traits.agility.value": randomClass.system.characterGuide.suggestedTraits.agility,
                "system.traits.strength.value": randomClass.system.characterGuide.suggestedTraits.strength,
                "system.traits.finesse.value": randomClass.system.characterGuide.suggestedTraits.finesse,
                "system.traits.instinct.value": randomClass.system.characterGuide.suggestedTraits.instinct,
                "system.traits.presence.value": randomClass.system.characterGuide.suggestedTraits.presence,
                "system.traits.knowledge.value": randomClass.system.characterGuide.suggestedTraits.knowledge
            };            
            await actor.update(updateTraits);

            const updateExperiences = {
                "system.experiences.mVgyxDqySWoFqrPy.name": getRandomExperience(),
                "system.experiences.mVgyxDqySWoFqrPy.value": 2,
                "system.experiences.mVgyxDqySWoFqrPy.core": true,
                "system.experiences.mVgyxDqySWoFqrPy.description": "",
                "system.experiences.VU4CT7JtT4y6jfNq.name": getRandomExperience(),
                "system.experiences.VU4CT7JtT4y6jfNq.value": 2,
                "system.experiences.VU4CT7JtT4y6jfNq.core": true,
                "system.experiences.VU4CT7JtT4y6jfNq.description": "",
            }            
            await actor.update(updateExperiences);
            
            const criteria = {
              domains: [randomClass.system.domains[0], randomClass.system.domains[1]]
            };
            const selectedCards = await getDomainCards(criteria, 2);
            itemData = selectedCards[0].toObject();
            await actor.createEmbeddedDocuments("Item", [itemData]);            
            itemData = selectedCards[1].toObject();
            await actor.createEmbeddedDocuments("Item", [itemData]);            
console.log("================")
console.log(selectedCards[0])
            // basic items        
            //itemData = randomClass.system.inventory.take[0];
            itemData = await fromUuid(randomClass.system.inventory.take[0].uuid);
            await actor.createEmbeddedDocuments("Item", [itemData]);            
            itemData = await fromUuid(randomClass.system.inventory.take[1].uuid);
            await actor.createEmbeddedDocuments("Item", [itemData]);            
            itemData = await fromUuid(randomClass.system.inventory.take[2].uuid);
            await actor.createEmbeddedDocuments("Item", [itemData]);            
            
            //suggested
            if (randomClass.system.characterGuide.suggestedPrimaryWeapon) {
              itemData = await fromUuid(randomClass.system.characterGuide.suggestedPrimaryWeapon.uuid);
              await actor.createEmbeddedDocuments("Item", [itemData]);          
            }
            if (randomClass.system.characterGuide.suggestedSecondaryWeapon) {
              itemData = await fromUuid(randomClass.system.characterGuide.suggestedSecondaryWeapon.uuid);
              await actor.createEmbeddedDocuments("Item", [itemData]);       
            }            
            if (randomClass.system.characterGuide.suggestedArmor) {
              itemData = await fromUuid(randomClass.system.characterGuide.suggestedArmor.uuid);
              await actor.createEmbeddedDocuments("Item", [itemData]);            
            }
            //choices
            let choiceA = [
              randomClass.system.inventory.choiceA[0],
              randomClass.system.inventory.choiceA[1]
            ];
            let choiceB = [
              randomClass.system.inventory.choiceB[0],
              randomClass.system.inventory.choiceB[1]
            ]            
            //itemData = choiceA[Math.floor(Math.random() * choiceA.length)];
            itemData = await fromUuid(choiceA[Math.floor(Math.random() * choiceA.length)].uuid);
            console.log(itemData)
            console.log("================")
            await actor.createEmbeddedDocuments("Item", [itemData]);            
            //itemData = choiceB[Math.floor(Math.random() * choiceB.length)];
            itemData = await fromUuid(choiceB[Math.floor(Math.random() * choiceB.length)].uuid);
            await actor.createEmbeddedDocuments("Item", [itemData]);            

            const commonData = {
              "name": getRandomCharacterName() + ' ('+ randomClass.name + ')'
            }            
            await actor.update(commonData);              
              
              
            // Open the actor sheet
            actor.sheet.render(true);
        }

    } catch (error) {
        console.error("Error creating actor:", error);
        ui.notifications.error("Failed to create actor. Check console for details.");
    }
}

// Execute the function
await createActor();

async function getDomainCards({ domains, level = 1 }, count = 2) {
  const compendiumId = "daggerheart.domains";
  const pack = game.packs.get(compendiumId);

  if (!pack) {
    const msg = `Compendium '${compendiumId}' not found.`;
    ui.notifications.error(msg);
    console.error(msg);
    return [];
  }

  // Get all documents from the compendium
  const allCards = await pack.getDocuments();

  // Filter the documents based on the provided criteria
  const filteredCards = allCards.filter(card =>
    card.system?.level === level &&
    domains.includes(card.system?.domain)
  );

  if (filteredCards.length === 0) {
    console.log("No cards found matching the criteria.");
    return [];
  }

  // Shuffle the filtered array to randomize it (Fisher-Yates shuffle)
  for (let i = filteredCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredCards[i], filteredCards[j]] = [filteredCards[j], filteredCards[i]];
  }

  // Return the first 'count' items from the shuffled array
  return filteredCards.slice(0, count);
}

/**
 * Sorteia uma experiência aleatória de uma lista predefinida e a exibe no chat do Foundry VTT.
 */

// 1. Cria uma função que contém e sorteia a experiência.
function getRandomExperience() {
  const allExperiences = [
    // Backgrounds
    "Assassin", "Blacksmith", "Bodyguard", "Bounty Hunter", "Chef to the Royal Family", "Circus Performer", "Con Artist", "Fallen Monarch", "Field Medic", "High Priestess", "Merchant", "Noble", "Pirate", "Politician", "Runaway", "Scholar", "Sellsword", "Soldier", "Storyteller", "Thief", "World Traveler",
    // Characteristics
    "Affable", "Battle-Hardened", "Bookworm", "Charming", "Cowardly", "Friend to All", "Helpful", "Intimidating Presence", "Leader", "Lone Wolf", "Loyal", "Observant", "Prankster", "Silver Tongue", "Sticky Fingers", "Stubborn to a Fault", "Survivor", "Young and Naive",
    // Specialties
    "Acrobat", "Gambler", "Healer", "Inventor", "Magical Historian", "Mapmaker", "Master of Disguise", "Navigator", "Sharpshooter", "Survivalist", "Swashbuckler", "Tactician",
    // Skills
    "Animal Whisperer", "Barter", "Deadly Aim", "Fast Learner", "Incredible Strength", "Liar", "Light Feet", "Negotiator", "Photographic Memory", "Quick Hands", "Repair", "Scavenger", "Tracker",
    // Phrases
    "Catch Me If You Can", "Fake It Till You Make It", "First Time’s the Charm", "Hold the Line", "I Won’t Let You Down", "I’ll Catch You", "I’ve Got Your Back", "Knowledge Is Power", "Nature’s Friend", "Never Again", "No One Left Behind", "Pick on Someone Your Own Size", "The Show Must Go On", "This Is Not a Negotiation", "Wolf in Sheep’s Clothing"
  ];

  // 2. Sorteia um índice aleatório da lista.
  const randomIndex = Math.floor(Math.random() * allExperiences.length);

  // 3. Retorna a experiência correspondente ao índice sorteado.
  return allExperiences[randomIndex];
}


// Macro to select random subclass from a class object and return it from compendium
// Foundry VTT v13 - Daggerheart System
async function getRandomSubClass(classObject) {
    try {
        // Check if the class object has subclasses
        if (!classObject.system || !classObject.system.subclasses || classObject.system.subclasses.length === 0) {
            console.warn("No subclasses found in the provided class object");
            ui.notifications.warn("No subclasses available for this class");
            return null;
        }
        
        // Get the subclasses array
        const subclassReferences = classObject.system.subclasses;
        console.log(`Found ${subclassReferences.length} subclasses for ${classObject.name}:`, subclassReferences);
        
        // Select a random subclass reference
        const randomIndex = Math.floor(Math.random() * subclassReferences.length);
        const selectedSubclassRef = subclassReferences[randomIndex];
        
        console.log(`Selected random subclass reference: ${selectedSubclassRef}`);
        const itemData = await fromUuid(selectedSubclassRef);
        return itemData;
        //await actor.createEmbeddedDocuments("Item", [itemData]);            
        console.log('aqui=========');
        console.log(itemData);
        console.log('=========');
        // Extract the ID from the compendium reference
        // Format: "Compendium.daggerheart.subclasses.Item.ID"
        const idMatch = selectedSubclassRef.match(/\.([^.]+)$/);
        if (!idMatch) {
            console.error("Could not extract ID from subclass reference:", selectedSubclassRef);
            ui.notifications.error("Invalid subclass reference format");
            return null;
        }
        
        const subclassId = idMatch[1];
        console.log(`Extracted subclass ID: ${subclassId}`);
        
        // Get the subclasses compendium
        const compendium = game.packs.get("daggerheart.subclasses");
        if (!compendium) {
            console.error("Compendium 'daggerheart.subclasses' not found");
            ui.notifications.error("Daggerheart subclasses compendium not found!");
            return null;
        }
        
        // Get the subclass document from the compendium
        const subclassDocument = await compendium.getDocument(subclassId);
        
        if (!subclassDocument) {
            console.error(`Subclass with ID ${subclassId} not found in compendium`);
            ui.notifications.error(`Subclass not found in compendium`);
            return null;
        }
        
        // Log and notify success
        //console.log(`Successfully retrieved subclass: ${subclassDocument.name}`);
        //ui.notifications.info(`Selected subclass: ${subclassDocument.name} for ${classObject.name}`);
        
        // Return the subclass document
        return subclassDocument;
        
    } catch (error) {
        console.error("Error getting random subclass:", error);
        ui.notifications.error("Failed to get random subclass. Check console for details.");
        return null;
    }
}

// Function to get a random ancestry from Daggerheart compendium
// Foundry VTT v13
async function getRandomAncestry() {
    try {
        // Get the Daggerheart ancestries compendium
        const compendium = game.packs.get("daggerheart.ancestries");
        
        if (!compendium) {
            console.error("Compendium 'daggerheart.ancestries' not found");
            ui.notifications.error("Daggerheart ancestries compendium not found!");
            return null;
        }
        
        // Load the compendium index to get all entries
        await compendium.getIndex();
        
        // Get all entries from the compendium and filter for ancestry type
        const allEntries = Array.from(compendium.index);
        const ancestryEntries = allEntries.filter(entry => entry.type === "ancestry");
        
        if (ancestryEntries.length === 0) {
            console.warn("No ancestry type items found in the compendium");
            ui.notifications.warn("No ancestry type items found in the compendium");
            return null;
        }
        
        // Select a random entry from ancestry items only
        const randomIndex = Math.floor(Math.random() * ancestryEntries.length);
        const randomEntry = ancestryEntries[randomIndex];
        
        // Get the full document from the compendium
        const randomAncestry = await compendium.getDocument(randomEntry._id);
        
        // Log the result
        //console.log(`Random ancestry selected: ${randomAncestry.name}`);
        //ui.notifications.info(`Random ancestry: ${randomAncestry.name}`);
        
        // Return the ancestry document
        return randomAncestry;
        
    } catch (error) {
        console.error("Error getting random ancestry:", error);
        ui.notifications.error("Failed to get random ancestry. Check console for details.");
        return null;
    }
}

// Function to get a random community from Daggerheart compendium
// Foundry VTT v13
async function getRandomCommunity() {
    try {
        // Get the Daggerheart communities compendium
        const compendium = game.packs.get("daggerheart.communities");
        
        if (!compendium) {
            console.error("Compendium 'daggerheart.communities' not found");
            ui.notifications.error("Daggerheart communities compendium not found!");
            return null;
        }
        
        // Load the compendium index to get all entries
        await compendium.getIndex();
        
        // Get all entries from the compendium and filter for community type
        const allEntries = Array.from(compendium.index);
        const communityEntries = allEntries.filter(entry => entry.type === "community");
        
        if (communityEntries.length === 0) {
            console.warn("No ancestry type items found in the compendium");
            ui.notifications.warn("No community type items found in the compendium");
            return null;
        }
        
        // Select a random entry from ancestry items only
        const randomIndex = Math.floor(Math.random() * communityEntries.length);
        const randomEntry = communityEntries[randomIndex];
        
        // Get the full document from the compendium
        const randomCommunity = await compendium.getDocument(randomEntry._id);
        
        // Log the result
        //console.log(`Random ancestry selected: ${randomAncestry.name}`);
        //ui.notifications.info(`Random ancestry: ${randomAncestry.name}`);
        
        // Return the ancestry document
        return randomCommunity;
        
    } catch (error) {
        console.error("Error getting random community:", error);
        ui.notifications.error("Failed to get random community. Check console for details.");
        return null;
    }
}

// Function to get a random class from Daggerheart compendium
// Foundry VTT v13
async function getRandomClass() {
    try {
        // Get the Daggerheart communities compendium
        const compendium = game.packs.get("daggerheart.classes");
        
        if (!compendium) {
            console.error("Compendium 'daggerheart.classes' not found");
            ui.notifications.error("Daggerheart classes compendium not found!");
            return null;
        }
        
        // Load the compendium index to get all entries
        await compendium.getIndex();
        
        // Get all entries from the compendium and filter for community type
        const allEntries = Array.from(compendium.index);
        const classEntries = allEntries.filter(entry => entry.type === "class");
        
        if (classEntries.length === 0) {
            console.warn("No class type items found in the compendium");
            ui.notifications.warn("No class type items found in the compendium");
            return null;
        }
        
        // Select a random entry from ancestry items only
        const randomIndex = Math.floor(Math.random() * classEntries.length);
        const randomEntry = classEntries[randomIndex];
        
        // Get the full document from the compendium
        const randomClass = await compendium.getDocument(randomEntry._id);
        
        // Log the result
        //console.log(`Random ancestry selected: ${randomAncestry.name}`);
        //ui.notifications.info(`Random ancestry: ${randomAncestry.name}`);
        
        // Return the ancestry document
        return randomClass;
        
    } catch (error) {
        console.error("Error getting random class:", error);
        ui.notifications.error("Failed to get random class. Check console for details.");
        return null;
    }
}

/**
 * Sorteia um nome de personagem de uma lista predefinida e o exibe.
 * @returns {string} Um nome aleatório da lista.
 */
function getRandomCharacterName() {
  const characterNames = [
    "Kaelen", "Lyra", "Thorgrym", "Elara", "Alistair", "Seraphina", "Borin", "Fenris",
    "Roric", "Isolde", "Grendel", "Zephyr", "Malcolm", "Anya", "Valerius", "Fiora",
    "Gareth", "Brida", "Corvus", "Lirael", "Cedric", "Maeve", "Torvin", "Briar",
    "Silas", "Nerida", "Jorn", "Cassian", "Finnian", "Sabriel", "Kael", "Evangeline",
    "Olen", "Gwendolyn", "Ronan", "Theron", "Percival", "Astrid", "Ivar", "Zaria",
    "Leoric", "Freya", "Halvar", "Orion", "Damon", "Morwen", "Bjorn", "Sorina",
    "Lucian", "Rhiannon", "Stig", "Valeriana", "Gregor", "Tamsin", "Ulfric", "Petra",
    "Aldric", "Ysabel", "Gunnar", "Mireille", "Rhys", "Beatrix", "Hakon", "Elina",
    "Torian", "Catriona", "Einar", "Saskia", "Drogan", "Daria", "Rolf", "Verity",
    "Baelor", "Elspeth", "Sten", "Linnea", "Kaelen", "Genevieve", "Torvald", "Azura",
    "Caden", "Isadora", "Vagn", "Samira", "Drake", "Lilith", "Asger", "Nyx",
    "Eamon", "Morgana", "Frode", "Calista", "Ferris", "Ophelia", "Gorm", "Ione",
    "Gideon", "Philippa", "Harald", "Delphine", "Hayden", "Rowena", "Knut", "Xylia",
    "Joric", "Sybil", "Leif", "Amara", "Kendrick", "Thea", "Magnar", "Ember",
    "Loric", "Ursula", "Olaf", "Wren", "Merrick", "Wilhelmina", "Roar", "Lyanna",
    "Niall", "Xanthe", "Sigurd", "Aris", "Orin", "Zephyra", "Toke", "Brann",
    "Phelan", "Althea", "Vidar", "Corbin", "Quintus", "Bryony", "Yngvar", "Darian",
    "Remy", "Cressida", "Arek", "Ezran", "Sterling", "Delia", "Brom", "Faelan",
    "Taliesin", "Eira", "Cyrus", "Garrick", "Ulric", "Faye", "Davor", "Hollis",
    "Vaughn", "Griselda", "Errol", "Jaxon", "Warwick", "Honora", "Galen", "Kian",
    "Zayne", "Imogen", "Hector", "Lorcan", "Anson", "Jessamine", "Jorah", "Milo",
    "Brennan", "Kerensa", "Lysander", "Nikolai", "Corbin", "Lavinia", "Marius", "Owen",
    "Declan", "Melisande", "Nestor", "Pax", "Erwan", "Nerissa", "Phineas", "Quinn",
    "Florian", "Octavia", "Raphael", "Raiden", "Gerard", "Portia", "Seneca", "Soren"
  ];

  // Calcula um índice aleatório baseado no tamanho da lista.
  const randomIndex = Math.floor(Math.random() * characterNames.length);

  // Retorna o nome que está na posição aleatória.
  return characterNames[randomIndex];
}
