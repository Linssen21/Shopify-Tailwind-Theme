class VariantSelector extends HTMLElement{
    constructor(){
        super();
        this.addEventListener("change", this.onVariantChange);
    }

    // Runs whenever the select elements changes
    onVariantChange(){
       this.getSelectedOptions();
       this.getSelectedVariant()

       if(this.currentVariant){
           this.updateURL();
           this.updateFormID();
           this.updatePrice();
           this.updateFeaturedImage();
       }
    }

    // Get the value from the Variants Selected options
    getSelectedOptions(){
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
        console.log(this.options);
    }

     // 
    /**
     * @description Get the Variant JSON setup on the select element
     * @returns {array} 
    */
    getVariantJSON(){
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent)
        console.log(this.variantData);
        return this.variantData;
    }

    /**
     * @descripion Get the selected variant base on (getSelectedOptions) and (getVariantJSON)
     */
    getSelectedVariant(){
        // Compare getVariantJSON data and the selected variant base on getSelectedOptions
        this.currentVariant = this.getVariantJSON().find(
            (variant) => {
                const findings = !variant.options.map(
                    (option, index) => {
                       return this.options[index] === option;
                    }
                ).includes(false);

                if(findings) return variant
            }
        )

        console.log(this.currentVariant);
        console.log(this.currentVariant.featured_image.src);
    }


    updateURL(){
        if(!this.currentVariant) return;

        window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}` )
    }

    updateFormID(){
        let form_input = document.querySelector("#product-form").querySelector('input[name="id"]');
        form_input.value = this.currentVariant.id
    }

    updateFeaturedImage(){
        // if(!this.currentVariant) return;
        let featuredImage = document.querySelector('#featured-image');
        featuredImage.src = this.currentVariant.featured_image.src;
    }

    async updatePrice(){
        try {
          const response = await fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`);
          const responseText = await response.text();
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const id = `price-${this.dataset.section}`

          const oldPrice = document.getElementById(id)
          const newPrice = html.getElementById(id)
        
            // if both price exist   replace the old price with the new one
          if(oldPrice && newPrice){
              oldPrice.innerHTML = newPrice.innerHTML;
          }

          console.log(oldPrice, newPrice)
        } catch (error) {
            
        }
       
    }

}

// Create's a custom element <variant-selector> </variant-selector>
customElements.define("variant-selector", VariantSelector);