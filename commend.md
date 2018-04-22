{{initiator}} {{#if initiatorDonationAmount}}donated {{amount initiatorDonationAmount}}{{else}}created a charity drive{{/if}} in honor of {{chooser}}'s {{contentType}}.

**[Donate here]({{donationFormUrl}})** to honor them too. {{#if chosenCharity}}{{chooser}} has picked [{{choseCharity.name}}]({{choseCharity.url}}) as the beneficiary charity.{{else}} {{chooser}} will be able to pick which charity all the donations go to. 

{{#if singleRecent}}{{donorName mostRecent}} donated {{amount mostRecent}} too.{{else}}
{{#if doubleRecent}}{{donorName mostRecent}} and one other have donated {{amount totalAmount}} in total.{{/if}}
{{#if manyRecent}}{{donorName mostRecent}} and {{numOthers}} others have donated {{amount totalAmount}} in total.{{/if}}