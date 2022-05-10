import getNewFeedItems from './feed';
import {
  addFeedItemToNotion,
  deleteOldUnreadFeedItemsFromNotion,
} from './notion';
import htmlToNotionBlocks from './parser';

async function index() {
  //console.log('Start','data' );
  
  const feedItems = await getNewFeedItems();
  //console.log(feedItems, "feedItems" );

  for (let i = 0; i < feedItems.length; i++) {
    const item = feedItems[i];

    const notionItem = {
      title: item.title,
      link: item.link,
      categories: item.categories,
      contentSnippet: item.contentSnippet,
      isoDate: item.isoDate,
      creator: item.creator,
      image: getImage(item),
      description: item.description,
      contentRaw: item['content:encoded'],
      content: htmlToNotionBlocks(item.content),
    };

    //console.log('___________________________________________________');
    //console.log(item);
    //console.log('___________________________________________________');
    await addFeedItemToNotion(notionItem);
  }

  await deleteOldUnreadFeedItemsFromNotion();
}

function findImageUrl(val) {
  const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
  const images = [];
  let img;
  console.log(val, 'data');
  console.log(imgRex.exec(val), 'data');

  // eslint-disable-next-line no-cond-assign
  while ((img = imgRex.exec(val))) {
    console.log(img, 'data');

    images.push(img[1]);
  }
  if (images.length) {
    console.log('_________________________________', 'data');

    console.log(images, 'data');
  }
  return images.length
    ? images[0]
    : 'https://akcdn.detik.net.id/visual/2021/05/25/ilustrasi-cryptocurrency-aristya-rahadian_169.jpeg?w=715&q=90';
}

function getImage(item) {
  if (item.image) {
    return item.image;
  }
  if (item.enclosure) {
    return item.enclosure.url;
  }
  if (item['content:encoded' || item.content]) {
    return findImageUrl(item['content:encoded'] || item.content);
  }
  return 'https://akcdn.detik.net.id/visual/2021/05/25/ilustrasi-cryptocurrency-aristya-rahadian_169.jpeg?w=715&q=90';
}

index();

// import getNewFeedItems from './feed';
// import {
//   addFeedItemToNotion,
//   deleteOldUnreadFeedItemsFromNotion,
// } from './notion';
// import htmlToNotionBlocks from './parser';

// async function index() {
//   const feedItems = await getNewFeedItems();

//   for (let i = 0; i < feedItems.length; i++) {
//     const item = feedItems[i];
//     const notionItem = {
//       title: item.title,
//       link: item.link,
//       categories: item.categories,
//       contentSnippet: item.contentSnippet,
//       isoDate: item.isoDate,
//       creator: item.creator,
//       description: item.description,
//       contentRaw:item["content:encoded"],
//       content:htmlToNotionBlocks(`<a src='${item.link}'>Link</a>`)
//       //content: htmlToNotionBlocks(item["content:encoded"]||item.content),
//     };
//     console.log(htmlToNotionBlocks(notionItem.contentRaw, 'data')
//     //console.log(htmlToNotionBlocks(notionItem.content, 'link')

//     await addFeedItemToNotion(notionItem);
//   }

//   await deleteOldUnreadFeedItemsFromNotion();
// }

// index();
