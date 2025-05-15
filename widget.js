document.addEventListener("DOMContentLoaded", () => {
  // Default‑Werte
  const DEFAULT_TECHNIKER    = ["Max Mustermann", "Alex Marzelon", "Lisa Beispiel"];
  const DEFAULT_STANDARD     = "";
  const DEFAULT_LABEL_TEXT   = "Techniker auswählen:";
  const DEFAULT_LABEL_HEIGHT = 30;
  const DEFAULT_OPTION_HEIGHT= 25;

  // DOM‑Elemente
  const label    = document.getElementById("label-techniker");
  const dropdown = document.getElementById("techniker");

  // Dropdown füllen und Höhe setzen
  function populateDropdown(list, standard, labelText, labelH, optionH) {
    label.textContent = labelText;
    dropdown.innerHTML = "";

    list.forEach(name => {
      const opt = document.createElement("option");
      opt.value       = name;
      opt.textContent = name;
      if (name === standard) opt.selected = true;
      dropdown.appendChild(opt);
    });

    const totalHeight = list.length * optionH + labelH;
    JFCustomWidget.setHeight(totalHeight);
  }

  // Wert-Änderung senden
  function handleChange() {
    JFCustomWidget.sendData({ value: dropdown.value });
  }

  // JotForm‑Integration
  if (typeof JFCustomWidget !== "undefined") {
    JFCustomWidget.subscribe("ready", () => {
      // Einstellungen laden
      JFCustomWidget.getWidgetSettings(settings => {
        try {
          // Parameter aus settings (widget.json → properties)
          const techString = settings.techniker || "";
          const techList   = techString
                                .split(",")
                                .map(s => s.trim())
                                .filter(s => s);
          const standard   = settings.standard?.trim()     || DEFAULT_STANDARD;
          const labelText  = settings.labelText?.trim()    || DEFAULT_LABEL_TEXT;
          const labelH     = parseInt(settings.labelHeight) || DEFAULT_LABEL_HEIGHT;
          const optionH    = parseInt(settings.optionHeight)|| DEFAULT_OPTION_HEIGHT;

          // Dropdown bauen
          populateDropdown(
            techList.length ? techList : DEFAULT_TECHNIKER,
            standard,
            labelText,
            labelH,
            optionH
          );

          // Initialen Wert senden
          JFCustomWidget.sendData({ value: dropdown.value || DEFAULT_STANDARD });

          // Change‑Listener
          dropdown.addEventListener("change", handleChange);

        } catch (e) {
          console.error("Widget Settings Error:", e);
          // Fallback-Dropdown
          populateDropdown(
            DEFAULT_TECHNIKER,
            DEFAULT_STANDARD,
            DEFAULT_LABEL_TEXT,
            DEFAULT_LABEL_HEIGHT,
            DEFAULT_OPTION_HEIGHT
          );
          JFCustomWidget.sendData({ value: DEFAULT_STANDARD });
          dropdown.addEventListener("change", handleChange);
        }
      });
    });
  } else {
    // Lokaler Testmodus
    populateDropdown(
      DEFAULT_TECHNIKER,
      DEFAULT_STANDARD,
      DEFAULT_LABEL_TEXT,
      DEFAULT_LABEL_HEIGHT,
      DEFAULT_OPTION_HEIGHT
    );
    dropdown.addEventListener("change", handleChange);
    console.log("Lokaler Testmodus – JotForm-Umgebung nicht gefunden.");
  }
});
