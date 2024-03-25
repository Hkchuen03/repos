const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, {likes}) => sum + likes, 0)
}

const favoriteBlog = (blogs) => {
  var maxA = blogs.reduce((a,b) => a.likes > b.likes ? a : b)

  const {_id, url, __v, ...mainBlogContent} = maxA

  return mainBlogContent
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}