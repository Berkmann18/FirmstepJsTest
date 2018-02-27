let filter = {};

$(document).ready(() => {
  let phones = [];
  $.getJSON( 'products.json', (data) => {
    phones = data;
    displayPhones(data);
    Object.keys(data[0].specs).forEach(spec => filter[spec] = new Set());
  });

  $('input[type="checkbox"]').each(function (idx) {
    $(this).on('change', () => {
      let self = $(this);
      const filterType = self.parent().parent().attr('id'), filterVal = self.attr('name'), enabled = self.is(':checked');

      (enabled) ? filter[filterType].add(filterVal) : filter[filterType].delete(filterVal);

      displayPhones(phones);
    });
  })
});

/**
 * @description Display phones' details contained in *data*.
 * @param {Object[]} phoneList Phone list
 */
const displayPhones = (phoneList) => {
  let items = phoneList.filter(phone => {
    let match = true;
    for (let flt in filter) {
      if (filter.hasOwnProperty(flt) && filter[flt].size) {
        let spec = String(phone.specs[flt]);
        match = match && filter[flt].has(spec);
      }
    }
    return match;
  }).map(phone => `
      	<li>
			<a href="#" class="product-photo">
				<img src="${phone.image.small}" height="130" alt="${phone.name}">
			</a>
			<h2><a href="#"> ${phone.name} </a></h2>
			<ul class="product-description">
				<li><span>Manufacturer: </span>${phone.specs.manufacturer}</li>
				<li><span>Storage: </span>${phone.specs.storage} GB</li>
				<li><span>OS: </span>${phone.specs.os}</li>
				<li><span>Camera: </span>${phone.specs.camera} Mpx</li>
				<li><span>Description: </span>${phone.description}</li>
			</ul>
			<p class="product-price">£${phone.price}</p>
		</li>`);
  $('#productList').html(items.length ? items.join('') : '<h3>No phone found :(</h3>');
};