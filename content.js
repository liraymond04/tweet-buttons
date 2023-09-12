let currentUrl = "";

// Add custom styles
const styleElement = document.createElement('style');

// Define the CSS rules as a string
const cssRules = `
  .tweet-buttons-flex {
    display: flex;
    gap: 30px;
  }

  .tweet-buttons-button {
    font-family: "TwitterChirp" !important;
    margin-bottom: 10px !important;
  }
  
  .tweet-buttons-button-underline {
    font-family: "TwitterChirp" !important;
    margin-bottom: 10px !important;
    text-decoration: underline !important;
    text-decoration-thickness: 1px !important;
  }
`;

// Set the text content of the <style> element to the CSS rules
styleElement.textContent = cssRules;

// Append the <style> element to the document's <head>
document.head.appendChild(styleElement);

// Get parent element of nth depth
const nthParent = (element, n) => {
  let current = element;
  for (let i = 0; i < n; i++) {
    current = current.parentElement;
  }
  return current;
}

// Make new element object for tweet button
const makeNewElement = (content, href) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = `<div dir="ltr" class="css-901oao r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0" style="color: rgb(113, 118, 123);"><a href="${href}" aria-describedby="id__uwio5mx1jvn" aria-label="6:28 PM · Sep 11, 2023" role="link" class="css-4rbku5 css-18t94o4 css-901oao css-16my406 r-1loqt21 r-xoduu5 r-1q142lx r-1w6e6rj r-poiln3 r-9aw3ui r-bcqeeo r-3s2u2q r-qvutc0" style="color: rgb(113, 118, 123);">${content}</a></div>`

  const aTag = newElement.children[0].children[0];
  aTag.classList.add('tweet-buttons-button');

  // Add event listeners for mouseenter (hover in) and mouseleave (hover out)
  aTag.addEventListener('mouseenter', (e) => {
    // Add the underline style on hover
    aTag.classList.remove('tweet-buttons-button');
    aTag.classList.add('tweet-buttons-button-underline');
  });

  aTag.addEventListener('mouseleave', (e) => {
    // Remove the underline style when the mouse leaves
    aTag.classList.add('tweet-buttons-button');
    aTag.classList.remove('tweet-buttons-button-underline');
  });

  return newElement
}

// Handle current page if it is a tweet
const handleTweetPage = () => {
  const allSpans = document.querySelectorAll('span');
  let spanWithViews;

  for (const span of allSpans) {
    if (span.textContent.includes('Views')) {
      spanWithViews = span;
      break; // Stop iterating once we find the first matching element
    }
  }

  if (spanWithViews) {
    // Found a <span> element with "Views" in its text content
    const bottomElement = nthParent(spanWithViews, 5);
    const tweetBody = bottomElement.parentElement;

    // Tweet buttons already added
    if (!!tweetBody.querySelector('.tweet-buttons-flex')) {
      return;
    }

    // Flex containing tweet buttons
    const flex = document.createElement('div');
    flex.classList.add('tweet-buttons-flex');

    // Tweet button definitions
    const reposts = makeNewElement("Reposts", currentUrl + '/retweets');
    const quotes = makeNewElement("Quotes", currentUrl + '/quotes');
    const likes = makeNewElement("Likes", currentUrl + '/likes');
    flex.appendChild(reposts);
    flex.appendChild(quotes);
    flex.appendChild(likes);

    // Append the new element as a child of the target element
    tweetBody.appendChild(flex);
    tweetBody.insertBefore(flex, bottomElement.nextSibling);
  }
}

// Check if current page is a tweet
const isTweetPage = () => {
  const regex = /https?:\/\/twitter\.com\/\w+\/status\/\d+/g
  return currentUrl.match(regex).length !== 0;
}

// Check if tweet content is loaded
const checkLoaded = () => {
  // Finds reply text area to check that post is loaded
  const el = document.querySelector('.public-DraftStyleDefault-block')
  if (el) return true;
  return false;
}

// Handle changes to the DOM
const onDomChange = () => {
  if (checkLoaded()) {
    const url = window.location.href;
    if (url !== currentUrl) {
      currentUrl = url;
      if (isTweetPage()) handleTweetPage();
    }
  }
}

// Listen for DOM changes
const observer = new MutationObserver(onDomChange);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

