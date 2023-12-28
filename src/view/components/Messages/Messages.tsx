import { Box, CircularProgress, Skeleton } from '@mui/material';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IIncidentComment, INITIAL_COMMENTS_LIMIT, useGetCommentsQuery } from 'src/redux/chat';
import { LocationsList } from 'src/view/pages/IncidentPage/LocationPage';

import { useVirtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { useGetMyProfileQuery } from 'src/redux/auth';
import { SetCommentsPageArgs, setCommentsPage } from 'src/redux/chat/reducer';
import MessageForm from './MessageForm';
import MessageItem from './MessageItem';
import css from './Messages.module.scss';
import './styles.scss';
const LoadMore = () => (
  <Box className={css.messageLoader}>
    <CircularProgress color='inherit' />
  </Box>
);

const LoadComponents = function () {
  const ref = useRef<HTMLDivElement>(null);
  const oneElement = useRef<HTMLDivElement>(null);
  const [visibleElems, setVisibleElems] = useState(0);
  useLayoutEffect(() => {
    const oneElementHeight = oneElement.current?.clientHeight;
    const containerHeight = ref.current?.clientHeight;
    if (!oneElementHeight || !containerHeight) return;
    setVisibleElems(Math.round(containerHeight / oneElementHeight) - 1);
  }, []);
  const OneElement = (
    <>
      <Box sx={{ pt: 0.5, width: '50%', marginLeft: 'auto' }}>
        <Skeleton sx={{ marginLeft: 'auto' }} />
        <Skeleton width='60% ' sx={{ marginLeft: 'auto' }} />
        <Skeleton width='80% ' sx={{ marginLeft: 'auto' }} />
      </Box>
      <Box sx={{ pt: 0.5, width: '50%', marginRight: 'auto' }}>
        <Skeleton sx={{ marginRight: 'auto' }} />
        <Skeleton width='60% ' sx={{ marginRight: 'auto' }} />
        <Skeleton width='80% ' sx={{ marginRight: 'auto' }} />
      </Box>
      <Box sx={{ pt: 0.5, width: '50%', marginLeft: 'auto' }}>
        <Skeleton sx={{ marginLeft: 'auto' }} />
        <Skeleton width='60% ' sx={{ marginLeft: 'auto' }} />
        <Skeleton width='80% ' sx={{ marginLeft: 'auto' }} />
      </Box>
    </>
  );

  return (
    <div ref={ref} className='messages-container'>
      <div className='messages-container-box' ref={oneElement}>
        {OneElement}
      </div>
      <div className='messages-container-box'>{Array(visibleElems).fill(OneElement)}</div>
    </div>
  );
};

function pageCreator(countAll: number) {
  return Math.floor(countAll / INITIAL_COMMENTS_LIMIT);
}

function usePage() {
  const dispatch = useAppDispatch();
  const { incidentId = '' } = useParams<LocationsList>();
  const page = useAppSelector((state) => state.chat.commentsPage[incidentId] ?? 0);
  const setPage = useCallback(
    (payload: SetCommentsPageArgs | ((arg: SetCommentsPageArgs) => SetCommentsPageArgs)) => {
      if (typeof payload === 'function') {
        dispatch(setCommentsPage(payload({ id: incidentId, data: page })));
      } else {
        dispatch(setCommentsPage(payload));
      }
    },
    [dispatch, page, incidentId]
  );

  return useMemo(() => [page, setPage] as const, [page, setPage]);
}

function useGetComments() {
  const { incidentId = '' } = useParams<LocationsList>();
  const page = useAppSelector((state) => state.chat.commentsPage[incidentId] ?? 0);

  const { data: user } = useGetMyProfileQuery();
  const { data, refetch, isLoading } = useGetCommentsQuery(
    { incidentId, userId: user?._id, page: page ?? 0 },
    { skip: !incidentId }
  );

  useEffect(() => {
    const pageFromList = pageCreator(data?.comments?.length ?? 0);
    if (
      !user?._id ||
      !incidentId ||
      pageFromList !== page ||
      data?.count !== INITIAL_COMMENTS_LIMIT
    )
      return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentId, refetch, user?._id, page, data?.comments?.length]);

  return useMemo(() => ({ data, userId: user?._id, isLoading }), [data, user?._id, isLoading]);
}

const Messages = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { data, userId, isLoading } = useGetComments();
  const [page, setPage] = usePage();

  const commentsLength = data?.comments?.length ?? 0;

  const virtualizer = useVirtualizer({
    count: data?.count === INITIAL_COMMENTS_LIMIT ? commentsLength + 1 : commentsLength,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();
  useEffect(() => {
    const [lastItem] = [...items].reverse();

    if (!lastItem) {
      return;
    }

    const pageFromList = pageCreator(data?.comments?.length ?? 0);
    const isNotLastPage = data?.count === INITIAL_COMMENTS_LIMIT;
    const isThisPageIsntFetched = pageFromList - 1 === page;

    if (lastItem.index >= commentsLength - 1 && !!data && isNotLastPage && isThisPageIsntFetched) {
      setPage((prev) => {
        return { id: prev.id, data: (prev.data || 0) + 1 };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsLength, data?.count, items?.length]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollToIndex = useCallback(virtualizer.scrollToIndex, []);

  return (
    <div className='messages'>
      <div className='messages-title'>
        <p>Comments</p>
      </div>
      <MessageForm userId={userId} scrollTo={scrollToIndex}>
        {isLoading ? (
          <LoadComponents />
        ) : (
          <div
            className='messages-container'
            ref={parentRef}
            style={{
              overflow: 'auto', // Make it scroll!
              contain: 'strict',
              marginBottom: '81px'
            }}
          >
            <div
              className='messages-container-box'
              style={{
                height: virtualizer.getTotalSize(),
                position: 'relative',
              }}
            >
              {items.map((virtualRow) => {
                const isLoaderRow = virtualRow.index > commentsLength - 1;
                const post = data?.comments[virtualRow.index] as IIncidentComment;
                const isMyMessage = userId === post?.userId?._id;

                return (
                  <div
                    data-index={virtualRow.index}
                    key={virtualRow.key}
                    data-messageId={post?._id}
                    className={classNames(
                      'element',
                      isMyMessage && 'isMyMessage',
                      isLoaderRow && 'isLoaderRow',
                      virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                    )}
                    ref={virtualizer.measureElement}
                    style={{
                      transform: `translate3d(0px, ${virtualRow.start}px, 0px)`,
                    }}
                  >
                    {isLoaderRow ? <LoadMore /> : <MessageItem item={post} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </MessageForm>
    </div>
  );
};

export default memo(Messages);
