// Dice Probability Calculator Macro for Foundry VTT v13

// Function to calculate probabilities
function calculateProbabilities(die1, die2, modifier, difficulty) {
    let totalOutcomes = 0;
    let successCount = 0;
    let failCount = 0;
    let critCount = 0;
    
    // Calculate modifier outcomes
    let modOutcomes = {};
    if (modifier === 0) {
        modOutcomes[0] = 1;
    } else if (modifier > 0) {
        // Advantage: +1d6
        for (let m = 1; m <= 6; m++) {
            modOutcomes[m] = 1;
        }
    } else {
        // Disadvantage: -1d6
        for (let m = -6; m <= -1; m++) {
            modOutcomes[m] = 1;
        }
    }
    
    // Iterate through all possible outcomes
    for (let d1 = 1; d1 <= die1; d1++) {
        for (let d2 = 1; d2 <= die2; d2++) {
            for (let mod in modOutcomes) {
                totalOutcomes++;
                let total = d1 + d2 + parseInt(mod);
                let isCrit = (d1 === d2);
                
                // Check for success: total >= difficulty OR matching dice
                if (total >= difficulty || isCrit) {
                    successCount++;
                }
                
                // Check for failure: total < difficulty AND dice don't match
                if (total < difficulty && !isCrit) {
                    failCount++;
                }
                
                // Check for critical: dice match (regardless of advantage/disadvantage)
                if (isCrit) {
                    critCount++;
                }
            }
        }
    }
    
    return {
        success: ((successCount / totalOutcomes) * 100).toFixed(2),
        fail: ((failCount / totalOutcomes) * 100).toFixed(2),
        crit: ((critCount / totalOutcomes) * 100).toFixed(2),
        totalOutcomes: totalOutcomes
    };
}

// Create dialog
let content = `
<form>
    <div class="form-group">
        <label>Die 1:</label>
        <select id="die1" name="die1">
            <option value="8">d8</option>
            <option value="10">d10</option>
            <option value="12" selected>d12</option>
            <option value="20">d20</option>
        </select>
    </div>
    <div class="form-group">
        <label>Die 2:</label>
        <select id="die2" name="die2">
            <option value="8">d8</option>
            <option value="10">d10</option>
            <option value="12" selected>d12</option>
            <option value="20">d20</option>
        </select>
    </div>
    <div class="form-group">
        <label>Roll Type:</label>
        <select id="rollType" name="rollType">
            <option value="1">Advantage (+1d6)</option>
            <option value="0" selected>Normal</option>
            <option value="-1">Disadvantage (-1d6)</option>
        </select>
    </div>
    <div class="form-group">
        <label>Difficulty:</label>
        <select id="difficulty" name="difficulty">
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10" selected>10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
        </select>
    </div>
</form>
`;

new Dialog({
    title: "Dice Probability Calculator",
    content: content,
    buttons: {
        calculate: {
            label: "Calculate",
            callback: (html) => {
                let die1 = parseInt(html.find('[name="die1"]').val());
                let die2 = parseInt(html.find('[name="die2"]').val());
                let rollType = parseInt(html.find('[name="rollType"]').val());
                let difficulty = parseInt(html.find('[name="difficulty"]').val());
                
                // Calculate probabilities
                let results = calculateProbabilities(die1, die2, rollType, difficulty);
                
                // Format dice notation
                let diceNotation = `1d${die1} + 1d${die2}`;
                if (rollType === 1) {
                    diceNotation += " + 1d6";
                } else if (rollType === -1) {
                    diceNotation += " - 1d6";
                }
                
                // Create chat message
                let chatContent = `
                    <div class="dice-probability-results">
                        <h3 style="color: red;">Probability Results</h3>
                        <p><strong>Dice:</strong> ${diceNotation}</p>
                        <p><strong>Difficulty:</strong> ${difficulty}</p>
                        <hr>
                        <p><strong>Success:</strong> ${results.success}%</p>
                        <p><strong>Failure:</strong> ${results.fail}%</p>
                        <p><strong>Critical:</strong> ${results.crit}%</p>
                    </div>
                `;
                
                ChatMessage.create({
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker(),
                    content: chatContent
                });
            }
        },
        cancel: {
            label: "Cancel"
        }
    },
    default: "calculate"
}).render(true);