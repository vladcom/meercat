import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';
// import { styled } from '@mui/material/styles';

// const useStyles = makeStyles(() => ({
//   input: {
//     backgroundColor: '#fff',
//   },
// }));
// const Root = styled('div')(({ theme }) => ({
//   [`&.${classes.root}`]: {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: theme.palette.primary.main,
//   },
//   [`& .${classes.cta}`]: {
//     borderRadius: theme.shape.radius,
//   },
//   [`& .${classes.content}`]: {
//     color: theme.palette.common.white,
//     fontSize: 16,
//     lineHeight: 1.7,
//   },
// }));

const InputLogin = forwardRef<TextFieldProps>(function InputLogin(props, ref) {
  return (
    <TextField
      fullWidth
      {...props}
      name='phone'
      size='small'
      inputRef={ref}
      variant='outlined'
      label='Phone Number'
      InputProps={
        {
          // className: classes.input,
        }
      }
    />
  );
});

export default InputLogin;
