import { Form, Formik } from 'formik';
import { memo } from 'react';
import * as Yup from 'yup';
import css from './SearchBox.module.scss';
import SearchBoxAutoComplete from './SearchBoxAutoComplete';
import { useMapStore } from 'src/view/components/MapContext';

export interface ISearchBox {
  address?: string;
  latitude: number;
  longitude: number;
}

const SearchBoxSchema = Yup.object({
  address: Yup.string(),
  latitude: Yup.number(),
  longitude: Yup.number(),
});

export const SearchBoxInitialValue = {
  address: '',
  latitude: 0,
  longitude: 0,
};

const SearchBox = () => {
  const planTo = useMapStore((state) => state.planTo);

  const onSubmit = (values: ISearchBox) => {
    const { latitude, longitude } = values;
    if (latitude && longitude) {
      planTo({ latitude, longitude, animate: true, zoom: 12 });
    }
  };

  return (
    <div className={css.searchBox}>
      <Formik<ISearchBox>
        initialValues={SearchBoxInitialValue}
        enableReinitialize
        validateOnMount={false}
        validateOnChange={false}
        validationSchema={SearchBoxSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <SearchBoxAutoComplete />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default memo(SearchBox);
