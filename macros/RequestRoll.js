//VERSION 1.1

// Macro for Foundry VTT v13 - Dice Roll with customizable options
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
        // Capture form values
        const difficulty = html.find('[name="difficulty"]').val();
        const trait = html.find('[name="trait"]').val();
        const reaction = html.find('[name="reaction"]').is(':checked');
        const advantage = html.find('[name="advantage"]').is(':checked');
        const disadvantage = html.find('[name="disadvantage"]').is(':checked');
        const label = html.find('[name="label"]').val().trim();
        
        // Build command string
        let command = "[[/dr";
        let params = [];
        
        // Add parameters only if they have valid values
        if (difficulty && difficulty !== "") {
          params.push(`difficulty=${difficulty}`);
        }
        
        if (trait && trait !== "") {
          params.push(`trait=${trait}`);
        }
        
        if (reaction) {
          params.push("reaction=true");
        }
        
        if (advantage) {
          params.push("advantage=true");
        }
        
        if (disadvantage) {
          params.push("disadvantage=true");
        }
        
        // Add parameters to command
        if (params.length > 0) {
          command += " " + params.join(" ");
        }
        
        command += "]]";
        
        // Add label if not empty
        if (label && label !== "") {
          command += `{${label}}`;
        }
        
        // Send command to chat
        const chatData = {
          user: game.user.id,
          speaker: ChatMessage.getSpeaker(),
          content: command,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER
        };
        
        ChatMessage.create(chatData);
        
        // Optionally, show command in console for debugging
        //console.log("Command sent:", command);
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