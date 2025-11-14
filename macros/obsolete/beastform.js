// CHANGE THIS PATH TO YOUR IMAGES FOLDER 
const imagesPath = "assets/druid/";



// Druid Transform Token Macro for Foundry VTT v13
// Reads images from assets/druid/ and allows token transformation

async function druidTransformMacro() {
    // Check if user has a selected token
    const selectedTokens = canvas.tokens.controlled;
    if (selectedTokens.length === 0) {
        ui.notifications.warn("Please select a token first!");
        return;
    }
    
    if (selectedTokens.length > 1) {
        ui.notifications.warn("Please select only one token!");
        return;
    }
    
    const token = selectedTokens[0];
    
    try {
        // Browse the assets/druid/ directory for image files
        const druidPath = imagesPath;
        const files = await FilePicker.browse("data", druidPath);
        
        // Filter for image files and get just the filenames without extensions
        const imageFiles = files.files.filter(file => {
            const extension = file.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
        });
        
        if (imageFiles.length === 0) {
            ui.notifications.error("No image files found in the directory!");
            return;
        }
        
        // Create options for the dialog (filename without extension)
        const options = imageFiles.map(filePath => {
            const filename = filePath.split('/').pop(); // Get just the filename
            const decodedFilename = decodeURIComponent(filename); // Decode %20 and other URL encoding
            const nameWithoutExt = decodedFilename.replace(/\.[^/.]+$/, ""); // Remove extension
            return {
                value: filePath,
                label: nameWithoutExt
            };
        }).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
        
        // Create the dialog HTML
        const dialogContent = `
            <div style="margin-bottom: 10px;">
                <p>Select a druid form for your token:</p>
            </div>
            <div style="margin-bottom: 15px;">
                <label for="form-select"><strong>Available Forms:</strong></label>
                <select id="form-select" style="width: 100%; padding: 5px; margin-top: 5px;">
                    ${options.map(option => 
                        `<option value="${option.value}">${option.label}</option>`
                    ).join('')}
                </select>
            </div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
                <p><em>Current token: ${token.document.name}</em></p>
            </div>
        `;
        
        // Show the dialog
        new Dialog({
            title: "Druid Transformation",
            content: dialogContent,
            buttons: {
                transform: {
                    label: "Transform",
                    callback: async (html) => {
                        const selectedImage = html.find('#form-select').val();
                        
                        if (!selectedImage) {
                            ui.notifications.error("No form selected!");
                            return;
                        }
                        
                        try {
                            // Update the token's image
                            await token.document.update({
                                "texture.src": selectedImage
                            });
                            
                            const formName = selectedImage.split('/').pop().replace(/\.[^/.]+$/, "");
                            //ui.notifications.info(`${token.document.name} transformed into ${formName}!`);
                            
                        } catch (error) {
                            console.error("Error updating token:", error);
                            ui.notifications.error("Failed to transform token. Check console for details.");
                        }
                    }
                },
                cancel: {
                    label: "Cancel"
                }
            },
            default: "transform",
            close: () => {}
        }, {
            width: 400,
            resizable: true
        }).render(true);
        
    } catch (error) {
        console.error("Error browsing druid directory:", error);
        ui.notifications.error("Could not access assets/druid/ directory. Make sure it exists and contains image files.");
    }
}

// Execute the macro
druidTransformMacro();