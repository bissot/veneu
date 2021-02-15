const SharedResourceResolvers = {
  SharedResource: {
    __resolveType: sharedResource => sharedResource.type
  }
};

const SearchResultResolvers = {
  SearchResult: {
    __resolveType: searchResult => searchResult.type
  }
};

module.exports = [
  SharedResourceResolvers,
  SearchResultResolvers,
  require("./Auth.Resolvers"),
  require("./Course.Resolvers"),
  require("./Notification.Resolvers"),
  require("./RegistrationSection.Resolvers"),
  require("./User.Resolvers"),
  require("./UserGroup.Resolvers")
];
