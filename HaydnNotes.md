


<!-- ----------------------------------------------------------------------- -->

With react hook form, getting a typing error when calling handle submit, the most common fix seems to be just disable the eslint rule for this but i dont want to do this. So we can adjust the type below, seen in this:
https://github.com/react-hook-form/react-hook-form/commit/7bfa3747f42ee648d0440c98d37be832a98805f2
`
 onInvalid?: SubmitErrorHandler<TFieldValues>
) => React.FormEventHandler<HTMLFormElement>;
`

simplest fix:
https://stackoverflow.com/questions/74190256/eslint-promise-returning-function-provided-to-attribute-where-a-void-return-was

<!-- ----------------------------------------------------------------------- -->