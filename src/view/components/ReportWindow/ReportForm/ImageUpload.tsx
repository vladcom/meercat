import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Button, CircularProgress } from '@mui/material';
import imageCompression from 'browser-image-compression';
import { useField } from 'formik';
import { ChangeEvent, memo, useCallback, useEffect } from 'react';
import { usePostIncidentImageMutation } from 'src/redux/incident';
import { useNotificationContext } from '../../NotificationsContext/NotificationsProvider';
import { IReportWindowForm } from '../ReportWindow';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};
const ImageUpload = () => {
  const [, , args] = useField<IReportWindowForm['imageUrl']>('imageUrl');
  const { openSnackbar } = useNotificationContext();

  const [uploadImage, { data: imageData, isLoading, isSuccess, isError }] =
    usePostIncidentImageMutation();

  useEffect(() => {
    if (isError) {
      openSnackbar({
        open: true,
        status: 'error',
        message: 'Try another photo',
      });
    }
  }, [isError, openSnackbar]);

  useEffect(() => {
    if (isSuccess && imageData?.Location) {
      args.setValue(imageData.Location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, imageData?.Location]);

  const handleImagePreview = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      const file = event.target.files[0];
      try {
        const compressedFile = await imageCompression(file, options);
        uploadImage({ image: compressedFile });
      } catch (error) {
        return openSnackbar({
          open: true,
          status: 'error',
          message: 'Try another photo',
        });
      }
    },
    [openSnackbar, uploadImage]
  );
  return (
    <div
      className={`reportWindow-form-upload ${
        imageData?.Location ? 'reportWindow-form-upload-loaded' : ''
      }`}
    >
      {isSuccess && imageData ? (
        <img
          className='reportWindow-form-upload-preview'
          src={imageData?.Location}
          alt={imageData?.Location}
        />
      ) : null}
      <Button variant='outlined' component='label' startIcon={<AddPhotoAlternateIcon />}>
        {isLoading ? (
          <CircularProgress style={{ width: '27px', height: '27px' }} />
        ) : <span>Add media</span>}
        <input hidden accept='image/*' type='file' onChange={handleImagePreview} />
      </Button>
    </div>
  );
};

export default memo(ImageUpload);
