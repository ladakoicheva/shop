import * as Yup from 'yup';

export const schema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .max(20, 'Must be 20 characters or less')
    .required('Required'),
  confPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match!'),
})