import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { IIncidentType, useGetIncidentTypesQuery } from 'src/redux/incident';
import toCapitalizeString from 'src/utils/toCapitalizeString';
import css from './FilterOptions.module.scss';

type OnChangeCategoriesFn = (props: { id?: string; isAll?: boolean }) => void;
type IClickToAllProps = {
  isActive?: boolean;
  onChangeCategories: OnChangeCategoriesFn;
};
const ClickToAll = memo(function ClickToAll({
  isActive = false,
  onChangeCategories,
}: IClickToAllProps) {
  return (
    <button
      onClick={() => {
        onChangeCategories({ isAll: true });
      }}
    >
      All
      {isActive && (
        <div className='filterOptions-check'>
          <FontAwesomeIcon icon={solid('check')} />
        </div>
      )}
    </button>
  );
});

type IRenderTypeProps = {
  categories: IIncidentType[];
  isUserDensity: boolean;
  onChangeCategories: OnChangeCategoriesFn;
  selectedCategories: Set<string>;
};
const RenderType = memo(function RenderType({
  categories,
  isUserDensity,
  onChangeCategories,
  selectedCategories,
}: IRenderTypeProps) {
  return (
    <>
      {categories.map((i) => {
        const isChecked = selectedCategories.has(i._id);
        return (
          <button
            key={i._id}
            disabled={isUserDensity}
            onClick={() => onChangeCategories({ id: i._id })}
          >
            {toCapitalizeString(i.name)}
            {isChecked && (
              <div className='filterOptions-check'>
                <FontAwesomeIcon icon={solid('check')} />
              </div>
            )}
          </button>
        );
      })}
    </>
  );
});

type ICategoryListProps = {
  selectedCategory: Set<string>;
  setCategory: React.Dispatch<React.SetStateAction<Set<string>>>;
  isUserDensity: boolean;
};

const CategoryList: React.FC<ICategoryListProps> = memo(function CategoryList({
  selectedCategory,
  setCategory,
  isUserDensity,
}: ICategoryListProps) {
  const { data: categories } = useGetIncidentTypesQuery(undefined);

  const [showMore, setShowMore] = useState(false);
  const shortCategories = useMemo(() => categories?.slice(0, 4) ?? [], [categories]);

  const onChangeCategories: OnChangeCategoriesFn = useCallback(
    ({ id, isAll }) => {
      if (isAll) {
        setCategory(new Set());
        return;
      }
      const selectedElements = new Set([...selectedCategory]);

      if (!id) return;
      //Should remove from selected
      if (selectedElements.has(id)) {
        selectedElements.delete(id);
      } else {
        selectedElements.add(id);
      }

      setCategory(selectedElements);
    },
    [selectedCategory, setCategory]
  );
  if (categories)
    return (
      <div>
        <p className={css['filterOptions-container-title']}>Category:</p>
        <div className={css['filterOptions-category']}>
          <ClickToAll
            isActive={selectedCategory.size === 0}
            onChangeCategories={onChangeCategories}
          />
          <RenderType
            categories={showMore ? categories : shortCategories}
            isUserDensity={isUserDensity}
            onChangeCategories={onChangeCategories}
            selectedCategories={selectedCategory}
          />
          <Button
            size='small'
            disabled={isUserDensity}
            onClick={() => (showMore ? setShowMore(false) : setShowMore(true))}
          >
            {showMore ? 'Show less' : 'Show more'}
          </Button>
        </div>
      </div>
    );
  return <></>;
});

type ICategoryListWrapper = ICategoryListProps;

function CategoryListWrapper({
  selectedCategory,
  setCategory,
  isUserDensity,
}: ICategoryListWrapper) {
  const { isSuccess } = useGetIncidentTypesQuery(undefined);

  if (isSuccess)
    return (
      <CategoryList
        selectedCategory={selectedCategory}
        setCategory={setCategory}
        isUserDensity={isUserDensity}
      />
    );

  return (
    <Stack spacing={1} alignItems='center'>
      <Skeleton variant='rectangular' width={210} height={80} />
      <Skeleton variant='rectangular' width={210} height={50} />
      <Skeleton variant='rectangular' width={210} height={70} />
    </Stack>
  );
}

export default memo(CategoryListWrapper);
