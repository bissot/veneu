const SharedResourceResolvers = {
  SharedResource: {
    __resolveType: sharedResource => {
      console.log(sharedResource);
      if (sharedResource.prefix) {
        return "Course";
      } else {
        return "UserGroup";
      }
    }
  }
};

const SearchResultResolvers = {
  SearchResult: {
    __resolveType: searchResult => {
      console.log(searchResult);
      if (searchResult.first_name) {
        return "User";
      }
      if (searchResult.prefix) {
        return "Course";
      } else {
        return "UserGroup";
      }
    }
  }
};

module.exports = [
  SharedResourceResolvers,
  SearchResultResolvers,
  require("./Auth.Resolvers"),
  require("./Course.Resolvers"),
  // require("./CourseRole.Resolvers"),
  require("./Notification.Resolvers"),
  require("./User.Resolvers"),
  require("./UserGroup.Resolvers")
];
