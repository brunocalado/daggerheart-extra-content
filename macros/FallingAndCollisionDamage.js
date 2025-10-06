// Daggerheart Falling Damage Macro
// Select fall height and roll damage

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
        
        // Determine formula and text based on selection
        switch(selection) {
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
        
        // Create the roll
        let roll = new Roll(damageFormula);
        await roll.evaluate();
        
        // Create chat message
        let chatContent = `
          <div class="daggerheart-falling-damage">
            <h3 style="color: red;">Falling & Collision Damage</h3>
            <p><strong>Height/Type:</strong> ${heightText}</p>
            <p><strong>Damage Type:</strong> ${damageType}</p>
            <p><strong>Formula:</strong> ${damageFormula}</p>
            <hr>
            <p><strong>Total Damage:</strong> ${roll.total}</p>
          </div>
        `;
        
        await roll.toMessage({
          speaker: ChatMessage.getSpeaker(),
          flavor: `<strong>${heightText} - ${damageType}</strong>`,
          content: chatContent
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