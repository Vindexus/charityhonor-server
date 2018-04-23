window.addEventListener('load', function() {
  Panda.init('pk_test_jDT1TStVcXG5lpFouAxBsg', 'panda_cc_form');

  Panda.on('success', function(cardToken) {
    console.log('cardToken');
    if (prompt("Copy this", cardToken)) {
      
    }
    $('[name=pandapay_token]').val(cardToken)
    $('#hidden-form [name=amount]').val($('#donation-form [name=amount]').val())
    $('#hidden-form [name=reddit_username]').val($('#donation-form [name=reddit_username]').val())
    $('#hidden-form [name=email]').val($('#cc-donation-email').val())
    $('#hidden-form').submit()
  });

  Panda.on('error', function(errors) {
    const form = document.getElementById('panda_cc_form')
    form.classList.add('was-validated');

    const inputs = form.querySelectorAll('input')
    inputs.forEach((input) => {
      input.setCustomValidity('')
    })

    errors.forEach((err) => {
      if (err.attribute == 'month' || err.attribute == 'year') {
        err.attribute = 'expiration'
      }
      else if (err.attribute  == 'number' || err.attribute == 'card_type') {
        err.attribute = 'credit_card'
      }
      const field = document.querySelector('[data-panda="' + err.attribute + '"]')
      console.log('field', field);
      console.log('err.attribute',err.attribute);
      field.setCustomValidity(err.message)
      const msg = field.parentNode.querySelector('.invalid-feedback')
      msg.innerHTML = err.message
    })
  });
}, false);

function submitPanda (e) {
  e.preventDefault()
  const form = e.target
  //document.getElementById('panda_cc_form').submit()
  if(form.checkValidity() == false) {
    form.classList.add('was-validated')
    return false
  }
  else {
    $('[role=panda-submit]').click()
  }
}
