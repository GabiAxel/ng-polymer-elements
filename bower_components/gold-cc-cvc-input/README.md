# gold-cc-cvc-input

`gold-cc-cvc-input` is a single-line text field with Material Design styling
for entering a credit card's CVC (Card Verification Code). It supports both
4-digit Amex CVCs and non-Amex 3-digit CVCs.

```html
    <gold-cc-cvc-input></gold-cc-cvc-input>

    <gold-cc-cvc-input card-type="amex"></gold-cc-cvc-input>
```

It may include an optional label, which by default is "CVC".

```html
    <gold-cc-cvc-input label="Card Verification Value"></gold-cc-cvc-input>
```

It can be used together with a `gold-cc-input` by binding the `cardType` property:

```html
    <gold-cc-input card-type="{{cardType}}"></gold-cc-input>
    <gold-cc-cvc-input card-type="[[cardType]]"></gold-cc-cvc-input>
```
