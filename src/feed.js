import Parser from 'rss-parser';
import timeDifference from './helpers';
import { getFeedUrlsFromNotion } from './notion';

async function getNewFeedItemsFrom(feedUrl) {
  const parser = new Parser();
  let rss;
  try {
    rss = await parser.parseURL(feedUrl);
   // console.log(rss, 'rss');
  } catch (error) {
    console.error(error);
    return [];
  }
  const todaysDate = new Date().getTime() / 1000;
  return rss.items.filter((item) => {
    const blogPublishedDate = new Date(item.pubDate).getTime() / 1000;
    const { diffInDays } = timeDifference(todaysDate, blogPublishedDate);
    return diffInDays === 0;
  });
}

export default async function getNewFeedItems() {
  let allNewFeedItems = [];

  const feeds = await getFeedUrlsFromNotion();
  //console.log(feeds, 'feeds');

  for (let i = 0; i < feeds.length; i++) {
    const { feedUrl } = feeds[i];
    const feedItems = await getNewFeedItemsFrom(feedUrl);
    allNewFeedItems = [...allNewFeedItems, ...feedItems];
  }
  //console.log(allNewFeedItems, "rss-parser")

  // sort feed items by published date
  allNewFeedItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

  return allNewFeedItems;
}
