document.addEventListener("DOMContentLoaded", () => {
  // Default‑Werte
  const DEFAULT_TECHNIKER = ["Max Mustermann", "Alex Marzelon", "Lisa Beispiel"];
  const DEFAULT_STANDARD   = "";
  const DEFAULT_LABEL_TEXT = "Techniker auswählen:";
  const DEFAULT_LABEL_HEIGHT  = 30;
  const DEFAULT_OPTION_HEIGHT = 25;

  // DOM‑Elemente
  const label    = document.getElementById("label-techniker");
  const dropdown = document.getElementById("techniker");

  // Hilfsfunktionen
  function populateDropdown(list, standard, labelText, labelH, optionH) {
    label.textContent = labelText;
    dropdown.innerHTML = "";

    list.forEach(name => {
      const opt = document.createElement("option");
      opt.value       = name.trim();
      opt.textContent = name.trim();
      if (name.trim() === standard) opt.selected = true;
      dropdown.appendChild(opt);
    });

    // Höhe: Label + Optionen
    const totalHeight = list.length * optionH + labelH;
    JFCustomWidget?.setHeight(totalHeight);
  }

  function handleChange() {
    JFCustomWidget?.sendData({ value: dropdown.value });
  }

  // JotForm‑Integration oder Fallback
  if (typeof JFCustomWidget !== "undefined") {
    JFCustomWidget.subscribe("ready", () => {
      JFCustomWidget.setHeight(DEFAULT_LABEL_HEIGHT + DEFAULT_OPTION_HEIGHT);
    });

    JFCustomWidget.getWidgetSettings(settings => {
      try {
        const techString = settings.techniker || "";
        const techList   = techString
                              .split(",")
                              .map(s => s.trim())
                              .filter(s => s.length);
        const standard   = settings.standard?.trim()   || DEFAULT_STANDARD;
        const labelText  = settings.labelText?.trim()  || DEFAULT_LABEL_TEXT;
        const labelH     = parseInt(settings.labelHeight)  || DEFAULT_LABEL_HEIGHT;
        const optionH    = parseInt(settings.optionHeight) || DEFAULT_OPTION_HEIGHT;

        populateDropdown(
          techList.length ? techList : DEFAULT_TECHNIKER,
          standard,
          labelText,
          labelH,
          optionH
        );
        dropdown.addEventListener("change", handleChange);
      } catch (e) {
        console.error("Widget Settings Error:", e);
        populateDropdown(
          DEFAULT_TECHNIKER,
          DEFAULT_STANDARD,
          DEFAULT_LABEL_TEXT,
          DEFAULT_LABEL_HEIGHT,
          DEFAULT_OPTION_HEIGHT
        );
        dropdown.addEventListener("change", handleChange);
      }
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
