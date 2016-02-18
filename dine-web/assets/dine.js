"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('dine/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'dine/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    rootElement: "#dine-app",
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('dine/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'dine/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var name = config['default'].APP.name;
  var version = config['default'].APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('dine/components/collection-card', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['card']
  });

});
define('dine/components/collection-restaurants-list', ['exports', 'dine/components/restaurants-list'], function (exports, RestaurantsListComponent) {

	'use strict';

	exports['default'] = RestaurantsListComponent['default'].extend({});

});
define('dine/components/collections-list', ['exports', 'dine/components/restaurants-list'], function (exports, RestaurantsListComponent) {

	'use strict';

	exports['default'] = RestaurantsListComponent['default'].extend({});

});
define('dine/components/dfp-ad', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({
		classNames: ["dfp-ad"],
		dfpService: null, //this will be injected by the dfp initializer
		divID: null,
		width: null,
		height: null,
		slot: null,
		/*
	 	if set the url should end to this in order to show
	 	if not set it shows always
	 */
		targetUrl: null,
		/*
	 	the dfp targeting to set before refreshing
	 	should be in form of array with object literals
	 	i.e. [{key:"the-key",value:"the-value-which-can-also-be-an-array-as-stated-in-docs"}]
	 */
		targeting: null,
		clearTargeting: false,
		endsWith: function endsWith(subjectString, searchString) {
			var position = subjectString.length;
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		},
		shouldShow: (function () {
			var targetUrl = this.get("targetUrl");
			if (!Em.isEmpty(targetUrl)) {
				if (Em.isArray(targetUrl)) {
					var result = false;
					for (var i = targetUrl.length - 1; i >= 0; i--) {
						result = this.endsWith(window.location.href, targetUrl[i]);
						if (result) {
							break;
						}
					}
					return result;
				} else {
					return this.endsWith(window.location.href, targetUrl);
				}
			} else {
				return true;
			}
		}).property("targetUrl"),
		setupDFPService: (function () {
			if (this.get("shouldShow")) {
				this.set("slot", this.get("dfpService.slots")[this.get("divID")]);
			}
		}).on("init"),
		setupSize: (function () {
			if (!Em.isEmpty(this.get("slot"))) {
				if (Em.isEmpty(this.get("width"))) {
					this.set("width", this.get("slot").getSizes()[0].l);
				}
				if (Em.isEmpty(this.get("height"))) {
					this.set("height", this.get("slot").getSizes()[0].j);
				}
			}
		}).on("slot"),
		setupDFPAd: (function () {
			var _this = this;

			if (this.get("shouldShow")) {
				var self = this;
				var googletag = window.googletag;
				googletag.cmd.push(function () {
					googletag.display(self.get("divID"));
				});
				if (!Em.isEmpty(this.get("slot")) && this.get("clearTargeting")) {
					this.get("slot").clearTargeting();
				}
				if (!Em.isEmpty(this.get("slot")) && !Em.isEmpty(this.get("targeting"))) {
					this.get("targeting").forEach(function (targetEntry) {
						_this.get("slot").setTargeting(Em.get(targetEntry, "key"), Em.get(targetEntry, "value"));
					});
				}
				if (googletag.pubads) {
					googletag.pubads().refresh([self.get("slot")]);
				}
			} else {
				this.$().css("display", "none");
			}
		}).on("didInsertElement")
	});

});
define('dine/components/is-mobile', ['exports', 'ember', 'dine/utils/common-utils'], function (exports, Ember, utils) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({
		show: true,
		isMobile: (function () {
			return utils['default'].isMobile();
		}).property()
	});

});
define('dine/components/loading-indicator', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({});

});
define('dine/components/modal-popup', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        modal: null,
        options: null,
        show: false,
        initModal: function initModal() {
            var modalElem = this.$('.modal').detach().appendTo("body");
            var modal = modalElem.modal(this.get("options") || {});
            this.set("modal", modal);
        },
        showModal: function showModal() {
            if (Em.isEmpty(this.get("modal"))) {
                this.initModal();
            } else {
                this.get("modal").modal("show");
            }
        },
        hideModal: function hideModal() {
            if (!Em.isEmpty(this.get("modal"))) {
                this.get("modal").modal("hide");
            }
        },
        setup: (function () {
            if (this.get("show")) {
                this.initModal();
            }
        }).on("didInsertElement")
    });

});
define('dine/components/restaurant-card', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['card'],
    setupComponent: (function () {
      var restaurant = this.get('restaurant');
      var images = restaurant.images;

      if (images.length > 0) {
        this.set('mainImage', images[0].url);
      }

      this.set('cuisines', Object.keys(restaurant.cuisines).map(function (k) {
        return restaurant.cuisines[k];
      }).join(', '));
    }).on('init').observes('restaurant')
  });

});
define('dine/components/restaurant-landing', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    cityService: Ember['default'].inject.service('city'),
    owl: null,
    setCurrentCity: (function () {
      var cityService = this.get('cityService');
      if (cityService.current.id) {
        this.set('cityName', cityService.current.name);
        this.set('citySlug', cityService.current.slug);
        if (!this.get('neighborhoods')) {
          this.set('neighborhoods', []);
        }
      }
    }).on('init'),
    configureCarousel: (function () {
      this.$('.cards-carousel .card-container').owlCarousel({
        baseClass: "owl-carousel",
        stagePadding: 70,
        loop: false,
        margin: 10,
        nav: true,
        dots: false,
        responsive: {
          0: {
            items: 1,
            stagePadding: 30
          },
          500: {
            items: 1
          },
          700: {
            items: 2
          },
          1000: {
            items: 3
          },
          1400: {
            items: 4
          }
        }
      });
    }).on('didInsertElement', 'didUpdate'),
    // reinitCarousel: function() {
    //   let collections = this.get('collections');
    //   if (collections && collections.length > 0) {
    //     debugger;
    //   }
    // }.observes('collections'),
    loadingNeighborhoods: (function () {
      var neighborhoods = this.get('neighborhoods');
      return neighborhoods !== null && neighborhoods.length === 0;
    }).property('neighborhoods'),
    loadingCollections: (function () {
      var collections = this.get('collections');
      return collections !== null && collections.length === 0;
    }).property('collections'),
    neighborhoodLabel: (function () {
      if (this.get('loadingNeighborhoods')) {
        return 'Loading...';
      } else if (this.get('neighborhoodName')) {
        return this.get('neighborhoodName');
      } else {
        return 'Neighborhood';
      }
    }).property('loadingNeighborhoods', 'neighborhoodName'),
    loadingCuisines: (function () {
      var cuisines = this.get('cuisines');
      return cuisines !== null && cuisines.length === 0;
    }).property('cuisines', 'neighborhoods'),
    cuisineLabel: (function () {
      if (this.get('loadingCuisines')) {
        return 'Loading...';
      } else if (this.get('cuisineName')) {
        return this.get('cuisineName');
      } else {
        return 'Cuisine';
      }
    }).property('loadingCuisines', 'cuisineName'),
    resetNeighborhood: function resetNeighborhood() {
      this.set('neighborhoods', []);
      this.set('neighborhoodSlug', "all");
      this.set('neighborhoodName', "All");
    },
    resetCusine: function resetCusine() {
      this.set('cuisines', []);
      this.set('cuisineSlug', "all");
      this.set('cuisineName', "All");
    },
    actions: {
      getNeighborhoods: function getNeighborhoods(citySlug) {
        var city = this.get('cities').findBy('slug', citySlug);

        this.$('.cards-carousel .card-container').owlCarousel('destroy');

        this.set('citySlug', citySlug);
        this.set('cityName', city.title);
        this.resetNeighborhood();
        this.set('collections', []);
        this.resetCusine();
        var self = this;
        Em.run.next(function () {
          self.sendAction('neighborhoodsAction', citySlug);
          self.sendAction('cuisinesAction', "all");
        });
      },
      getCuisines: function getCuisines(neighborhoodSlug) {
        if (neighborhoodSlug === "all") {
          this.set('neighborhoodSlug', neighborhoodSlug);
          this.set('neighborhoodName', "All");
        } else {
          var neighborhood = this.neighborhoods.findBy('slug', neighborhoodSlug);

          this.set('neighborhoodSlug', neighborhoodSlug);
          this.set('neighborhoodName', neighborhood.name);
        }

        this.set('cuisines', []);
        this.set('cuisineSlug', "all");
        this.set('cuisineName', "All");

        this.sendAction('cuisinesAction', neighborhoodSlug);
      },
      selectCuisine: function selectCuisine(cuisineSlug) {
        if (cuisineSlug === "all") {
          this.set('cuisineSlug', cuisineSlug);
          this.set('cuisineName', "All");
        } else {
          var cuisine = this.cuisines.findBy('slug', cuisineSlug);

          this.set('cuisineName', cuisine.name);
          this.set('cuisineSlug', cuisineSlug);
        }
      },
      search: function search() {
        this.get('router').transitionTo('city.restaurants', this.get('citySlug'), this.get('neighborhoodSlug') || 'all', this.get('cuisineSlug') || 'all');
      }
    }
  });

});
define('dine/components/restaurant-map', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    cityService: Ember['default'].inject.service('city'),
    mapStyles: { style: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }] },
    entries: [],
    google: null,
    map: null,
    markers: [],
    rerenderComponent: (function () {
      if (this.get('entries').length === 0) {
        return false;
      }

      this.setupMap();
      this.rerender();
    }).observes('entries'),
    setupMap: (function () {
      var self = this;

      window.GoogleMapsLoader.load(function (google) {
        self._createMap(google);
        //checking if artice section is displayed on top of map or not
        // if not displayed on top of map then center the marker
        if (self.get("entries").length === 1 && parseInt($(".article-section-header").css("margin-bottom"), 10) !== 0) {
          var idleListener = google.maps.event.addListener(self.get("map"), "idle", function () {
            var restaurantMarkerLocation = self.get("entries")[0].geoLocation;
            self.get("map").setCenter(new google.maps.LatLng(restaurantMarkerLocation.latitude, restaurantMarkerLocation.longitude));
            google.maps.event.removeListener(idleListener);
          });
        }
      });
    }).on('didInsertElement'),
    _createMap: function _createMap(google) {
      var mapStyles = this.mapStyles;
      var cityService = this.get('cityService');
      var latLng = {
        lat: cityService.current.geoLocation.latitude,
        lng: cityService.current.geoLocation.longitude
      };

      this.set('google', google);

      this.set('map', new google.maps.Map(this.$("#restaurantsMap").get(0), {
        center: latLng,
        scrollwheel: false,
        styles: mapStyles.style,
        zoom: 12,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
        }
      }));

      if (this.get('entries').length > 0) {
        this._createMarkers();
      }
    },
    _createMarkers: function _createMarkers() {
      window.entryDetails = this.get("entries");
      window.initializeArticleMap(this.map);
    },
    _createEntryMarkerAtPoint: function _createEntryMarkerAtPoint(entry, point, hide) {
      var section = entry.navSectionName;

      var marker = new this.google.maps.Marker({
        position: point,
        map: this.map,
        icon: entry.icon
      });

      var contentDiv = this._getEntryInfoWindowContent(entry);
      var infowindow = new google.maps.InfoWindow({
        maxWidth: 274,
        content: contentDiv,
        borderRadius: 4
      });

      var self = this;
      this.google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(contentDiv);
        infowindow.open(self.map, this);
      });

      return marker;
    },
    _templateInfoWindow: function _templateInfoWindow(data) {
      return '<div class="info-box" style="border: 1px solid white; margin-top: 8px; background: white; padding: 20px;overflow: hidden;">\n      <h3 style="font-family: " mark-pro\';="" font-size:="" 16px;\'="">\n        <a href="' + data.restaurantURL + '">' + data.estName + '</a>\n      </h3>\n      <p>\n        ' + data.estStreet + '\n        <br>\n        ' + data.estCity + ', ' + data.estState + ' ' + data.estZip + '\n        <br>\n        ' + data.estPhone + '\n      </p>\n    </div>';
    },
    _getEntryInfoWindowContent: function _getEntryInfoWindowContent(entry) {
      var parsedUrl = entry.parsedUrl;

      if (!parsedUrl) {
        parsedUrl = window.encodeURI(entry.estUrl);
      }

      return this._templateInfoWindow({
        "address": entry.address,
        "estCity": entry.estCity,
        "estName": entry.estName,
        "estPhone": entry.estPhone,
        "estState": entry.estState,
        "estStreet": entry.estStreet,
        "estUrl": entry.estUrl,
        "estZip": entry.estZip,
        "parsedUrl": parsedUrl,
        "restaurantURL": entry.restaurantURL
      });
    },
    _fitPointsWithBounds: function _fitPointsWithBounds(bounds, pointCnt, maxZoomLevel) {
      if (bounds != null) {
        var center = bounds.getCenter();

        if (pointCnt > 1) {
          this.map.fitBounds(bounds);
        } else {
          var zoomLevel = Math.min(maxZoomLevel, this.map.getZoom());
          this.map.setZoom(zoomLevel);

          if (this.get('offset')) {
            var scale = Math.pow(2, this.map.getZoom());
            var pixelOffset = new google.maps.Point(0, 550 / scale);
            var latLng = {
              lat: center.lat(),
              lng: center.lng() - pixelOffset.y
            };
            this.map.setCenter(latLng);
          } else {
            this.map.setCenter(center);
          }
        }
      }
    }
  });

});
define('dine/components/restaurants-list', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    resultsKey: 'restaurants',
    setupComponent: (function () {
      var results = this.get(this.get('resultsKey'));
      var featureLabel = this.get('featureLabel');
      var cuisineLabel = this.get('cuisineLabel');
      var neighborhoodLabel = this.get('neighborhoodLabel');

      var resultMessage = results.length + ' results for ';

      if (featureLabel && featureLabel !== 'Feature') {
        resultMessage += featureLabel;
      } else if (cuisineLabel && cuisineLabel !== 'Cuisine') {
        resultMessage += cuisineLabel;
      } else if (neighborhoodLabel && neighborhoodLabel !== 'Neighborhood') {
        resultMessage += neighborhoodLabel;
      } else {
        resultMessage += this.get('cityName');
      }

      this.set('resultMessage', resultMessage);

      this._resetProperties();
      this._paginate();
    }).on('init').observes('restaurants', 'collections'),
    _resetProperties: function _resetProperties() {
      this.set('paginatedResults', []);
      this.set('page', null);
      this.set('showLoadMore', null);
    },
    _paginate: function _paginate() {
      var results = this.get(this.get('resultsKey'));
      var paginatedResults = this.get('paginatedResults') || [];
      var page = this.get('page') || 1;
      var totalPerPage = 20;
      var limit = totalPerPage * page;
      var startIndex = totalPerPage * (page - 1);
      var pages = results.length / totalPerPage;

      if (pages % 1 > 0) {
        pages = window.Math.floor(pages) + 1;
      } else {
        pages = window.Math.floor(pages);
      }

      if (results.length - startIndex < totalPerPage) {
        limit = results.length;
      }

      for (var i = startIndex; i < limit; i++) {
        paginatedResults.push(results[i]);
      }

      page += 1;
      this.set('page', page);
      this.set('paginatedResults', paginatedResults);
      this.set('showLoadMore', page <= pages);
      this.rerender();
    },
    actions: {
      loadMore: function loadMore() {
        this._paginate();
      }
    }
  });

});
define('dine/components/restaurants-map-search', ['exports', 'ember', 'dine/config/environment'], function (exports, Ember, config) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        cityService: Ember['default'].inject.service('city'),
        searchClient: null,
        searchIndex: null,
        setupAlgoliaSearch: (function () {
            var self = this;
            var input = this.$('.map-search form input');
            var algoliaClient = window.algoliasearch(config['default'].APP.Algolia.applicationId, config['default'].APP.Algolia.searchOnlyAPIKey);
            var algoliaIndex = algoliaClient.initIndex('Restaurants - ' + this.get('cityService').current.name);
            self.set("searchClient", algoliaClient);
            self.set("searchIndex", algoliaIndex);
            var params = {
                hitsPerPage: 22,
                facets: '*'
            };
            var theTypeahead = input.typeahead({
                minLength: 3,
                highlight: true
            }, {
                name: 'restaurants',
                display: 'title',
                limit: 20,
                source: function source(query, syncCb, asyncCb) {
                    var cb;
                    if (typeof asyncCb === 'function') {
                        // typeahead 0.11
                        cb = asyncCb;
                    } else {
                        // pre typeahead 0.11
                        cb = syncCb;
                    }

                    self.get("searchIndex").search(query, params, function searchDone(err, content) {
                        if (err) {
                            cb(err);
                            return;
                        }

                        cb(content.hits);
                    });
                },
                templates: {
                    empty: ['<div class="empty-message">', 'unable to find any restaurants that match the current query', '</div>'].join('\n'),
                    suggestion: function suggestion(data) {
                        return '<div><strong>' + data.title + '</strong><br><small>' + data.neighborhood + '</small></div>';
                    }
                }
            });

            theTypeahead.on('typeahead:selected', function (event, data) {
                var citySlug = window.getSlug(data.city.title.trim());
                var restaurantSlug = window.getSlug(data.title.trim()) + '-' + data.id;
                self.router.transitionTo('city.restaurant', citySlug, restaurantSlug);
            });
            this.setupPlaceholder();
            this.set("theTypeahead", theTypeahead);
        }).on('didInsertElement'),
        setupPlaceholder: (function () {
            var input = this.$('.map-search form input.tt-input');
            input.attr("placeholder", "Search Restaurants in " + this.get('cityService').current.name);
        }).observes("cityService.current"),
        updateSearchIndex: (function () {
            var algoliaIndex = this.get("searchClient").initIndex('Restaurants - ' + this.get('cityService').current.name);
            this.set("searchIndex", algoliaIndex);
        }).observes("cityService.current"),
        keyDown: function keyDown(e) {
            if (e.which === 13 || e.keyCode === 13) {
                this.send("searchAction");
            }
        },
        actions: {
            searchAction: function searchAction() {
                window.NProgress.start();
                var router = this.get("router");
                var searchQuery = this.$(".map-search form input.tt-input").val().trim();

                this.get("cityService").searchRestaurants(searchQuery, null, function (restaurants) {
                    window.NProgress.done();
                    if (!Em.isEmpty(restaurants)) {
                        router.intermediateTransitionTo("city.loading");
                        Em.run.next(function () {
                            router.transitionTo('city.restaurantsWithFeatures', restaurants, { queryParams: { searchQuery: searchQuery } });
                        });
                    }
                });
            }
        }
    });

});
define('dine/components/restaurants-map', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    restaurants: [],
    entries: [],
    rerenderComponent: (function () {
      var callRerender = this.get('entries').length > 0;

      this.setupEntries();

      if (callRerender) {
        this.rerender();
      }
    }).on('willInsertElement').observes('restaurants'),
    setupEntries: function setupEntries() {
      var self = this;
      var entries = [];

      this.get('restaurants').forEach(function (restaurant) {
        entries.push({
          estName: restaurant.title,
          address: restaurant.address,
          geoLocation: restaurant.geoLocation,
          icon: 'http://staticcdn11.tastingtable.com/v_2016/images/map-pin.png',
          estUrl: restaurant.menuURL || restaurant.opentableLink,
          estStreet: restaurant.address,
          estCity: restaurant.city.name,
          estState: restaurant.city.state,
          estZip: restaurant.zip,
          estPhone: restaurant.phone,
          restaurantURL: self.router.generate('city.restaurant', restaurant.city.slug, restaurant.slug)
        });
      });

      this.set('entries', entries);
    }
  });

});
define('dine/components/search-auto-complete', ['exports', 'ember-cli-auto-complete/components/auto-complete'], function (exports, AutoComplete) {

	'use strict';

	exports['default'] = Ember.Component.extend({});

});
define('dine/components/smart-app-banner', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    /*
    This component provides functionality for showing the branch metrics smart app banner
    after it has been render to the DOM, by using the branch-metrics service.
    It assists in cases where no component is present on template and a smart app banner 
    is required. Otherwise any other component can use the branch-metrics service as well.
    */
    exports['default'] = Ember['default'].Component.extend({
        branchMetrics: Em.inject.service("branch-metrics"),
        bannerOptions: null,
        bannerData: null,
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            Ember['default'].run.scheduleOnce('afterRender', this, this.afterRenderEvent);
        },
        afterRenderEvent: function afterRenderEvent() {
            this.showSmartAppBanner();
        },
        showSmartAppBanner: function showSmartAppBanner() {
            var brMetrics = this.get("branchMetrics");
            var bannerOptions = this.get("bannerOptions");
            var bannerData = this.get("bannerData") || {};
            brMetrics.showSmartAppBanner(bannerOptions, bannerData);
        }
    });

});
define('dine/components/updates-feed', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      goToUpdatePage: function goToUpdatePage(update) {
        if (update.isCollection) {
          this.router.transitionTo('collections.city.restaurants', update.citySlug, update.collectionSlug);
        } else {
          var restaurant = update.restaurant;
          var neighborhoodName = restaurant.get('neighborhood').trim();
          var neighborhoodSlug = window.getSlug(neighborhoodName);
          var restaurantTitle = update.restaurantName;
          var restaurantSlug = update.restaurantSlug;
          var cuisines = restaurant.get('cuisine').split(",");
          var features = restaurant.get('tags').split(",");
          var images = restaurant.get('imagesArray') || [];
          var attributes = restaurant.attributes;

          cuisines = cuisines.map(function (cuisineName) {
            return window.getSlug(cuisineName.trim());
          });

          features = features.map(function (featureName) {
            return window.getSlug(featureName.trim());
          });

          attributes.id = restaurant.id;
          attributes.city = update.city;
          attributes.cuisines = cuisines;
          attributes.features = features;
          attributes.images = images;
          attributes.neighborhood = neighborhoodName;
          attributes.neighborhoodSlug = neighborhoodSlug;
          attributes.slug = restaurantSlug;
          attributes.title = restaurantTitle;

          window.sessionStorage.setItem('currentRestaurant', window.JSON.stringify(attributes));
          this.router.transitionTo('city.restaurant', update.citySlug, update.restaurantSlug);
        }
      }
    }
  });

});
define('dine/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dine/controllers/city/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    neighborhoodSlug: "all",
    cuisineSlug: "all",
    featureSlug: "all"
  });

});
define('dine/controllers/city/neighborhood', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('dine/controllers/city/restaurants-with-features', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({
		queryParams: { searchQuery: "q" },
		searchQuery: null
	});

});
define('dine/controllers/city/restaurants', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({
		queryParams: { searchQuery: "q" },
		searchQuery: null
	});

});
define('dine/controllers/city', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    neighborhoodSlug: "all",
    cuisineSlug: "all",
    featureSlug: "all"
  });

});
define('dine/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dine/helpers/is-equal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.isEqual = isEqual;

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  function isEqual(_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var leftSide = _ref2[0];
    var rightSide = _ref2[1];

    return leftSide === rightSide;
  }

  exports['default'] = Ember['default'].Helper.helper(isEqual);

});
define('dine/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, moment_duration) {

	'use strict';



	exports['default'] = moment_duration['default'];

});
define('dine/helpers/moment-format', ['exports', 'ember', 'dine/config/environment', 'ember-moment/helpers/moment-format'], function (exports, Ember, config, Helper) {

  'use strict';

  exports['default'] = Helper['default'].extend({
    globalOutputFormat: Ember['default'].get(config['default'], 'moment.outputFormat'),
    globalAllowEmpty: !!Ember['default'].get(config['default'], 'moment.allowEmpty')
  });

});
define('dine/helpers/moment-from-now', ['exports', 'ember', 'dine/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, Ember, config, Helper) {

  'use strict';

  exports['default'] = Helper['default'].extend({
    globalAllowEmpty: !!Ember['default'].get(config['default'], 'moment.allowEmpty')
  });

});
define('dine/helpers/moment-to-now', ['exports', 'ember', 'dine/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, Ember, config, Helper) {

  'use strict';

  exports['default'] = Helper['default'].extend({
    globalAllowEmpty: !!Ember['default'].get(config['default'], 'moment.allowEmpty')
  });

});
define('dine/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'dine/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](config['default'].APP.name, config['default'].APP.version)
  };

});
define('dine/initializers/component-router-injector', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject('component', 'router', 'router:main');
  }

  exports['default'] = {
    name: 'component-router-injector',
    initialize: initialize
  };

});
define('dine/initializers/constants', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject('route', 'constants', 'service:constants');
    application.inject('controller', 'constants', 'service:constants');
    application.inject('component', 'constants', 'service:constants');
  }

  exports['default'] = {
    name: 'constants',
    initialize: initialize
  };

});
define('dine/initializers/dfp', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    //force initialization of dfp service
    application.inject('component', 'dfpService', 'service:dfp');
  }

  exports['default'] = {
    name: 'dfp',
    initialize: initialize
  };

});
define('dine/initializers/export-application-global', ['exports', 'ember', 'dine/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('dine/initializers/init', ['exports'], function (exports) {

	'use strict';

	exports.initialize = initialize;

	function initialize(container, application) {

		(function initLists($) {
			$("body").on("focus", ".menu,.dropdown", function () {
				$(this).addClass("hover");
			});
			$("body").on("blur", ".menu,.dropdown", function () {
				$(this).removeClass("hover");
			});
		})(jQuery);
	}

	exports['default'] = {
		name: 'init',
		initialize: initialize
	};

});
define('dine/initializers/nprogress', ['exports', 'dine/config/environment'], function (exports, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    window.NProgress.configure({ showSpinner: false });
  }

  exports['default'] = {
    name: 'nprogress',
    initialize: initialize
  };

});
define('dine/initializers/overrides', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize() /* container, application */{

    Ember.Route.reopen({
      activate: function activate() {
        this._super.apply(this, arguments);
        window.scrollTo(0, 0);
      },
      actions: {
        didTransition: function didTransition() {
          Ember.run.scheduleOnce("afterRender", this, function () {
            if (!Modernizr.cssanimations) {
              // instead of opacity and animate, consider fadeIn
              // $("#dine-app.fade-content").css("opacity", 0);
              // $("#dine-app.fade-content").delay(100).animate({opacity:1},500);
              $("#dine-app.fade-content").css("opacity", 1);
              $("#dine-app.fade-content").css("display", "none");
              $("#dine-app.fade-content").fadeIn(500);
            } else {
              $("#dine-app.fade-content").css("display", "block");
              $("#dine-app.fade-content").removeClass("fade-in");
              $("#dine-app.fade-content").addClass("fade-in");
            }
          });
        },
        willTransition: function willTransition() {
          $("#dine-app.fade-content").removeClass("fade-in");
        }
      }
    });
  }

  exports['default'] = {
    name: 'overrides',
    initialize: initialize
  };

});
define('dine/router', ['exports', 'ember', 'dine/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('city', { path: '/' }, function () {
      this.route('restaurants', { path: '/:citySlug/:neighborhoodSlug/:cuisineSlug/restaurants' });
      this.route('restaurantsWithFeatures', { path: '/:citySlug/:neighborhoodSlug/:cuisineSlug/:featureSlug/restaurants' });
      this.route('restaurant', { path: '/:citySlug/:restaurantSlug' });

      this.route('collections', { path: '/:citySlug/lists' }, function () {
        this.route('restaurants', { path: '/:collectionSlug' }, function () {
          this.route('restaurant', { path: '/:restaurantSlug' });
        });
      });
    });

    this.route('updates', { path: '/updates' });
    this.route('updates.city', { path: '/:citySlug/updates' });
  });

  exports['default'] = Router;

});
define('dine/routes/city/collections/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    cityService: Ember['default'].inject.service('city'),
    activate: function activate() {
      Ember['default'].$('body').removeClass('section-restaurant-landing').removeClass('section-restaurant').removeClass('js-restaurant-page').addClass('section-map-app').addClass('sticky-map').addClass('js-dine-in-app');
      Ember['default'].$('.wave.dine').hide();
      Ember['default'].$('footer').hide();
      Ember['default'].$('.js-loading-indicator').addClass('hidden');
      Ember['default'].$('.js-content-toggle').removeClass('hidden');
    },
    deactivate: function deactivate() {
      Ember['default'].$('body').removeClass('section-map-app').removeClass('js-dine-in-app').removeClass('section-restaurant').removeClass('js-restaurant-page').removeClass('sticky').removeClass('sticky-map').addClass('section-restaurant-landing');
      Ember['default'].$('.wave.dine').show();
      Ember['default'].$('footer').show();
    },
    beforeModel: function beforeModel(transition) {
      window.NProgress.start();

      var self = this;
      var params = transition.params['city.collections'];
      var cityService = self.get('cityService');
      var citySlug = params.citySlug;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var cities = self.modelFor('city');
        var city = cities.findBy('slug', citySlug);

        if (!cityService.current.id || cityService.current.slug !== city.slug) {
          cityService.addCurrent(city);
        }

        resolve(city);
      }, function (error) {
        reject(error);
      });
    },
    model: function model(params) {
      var self = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        self.get('cityService').getCollections().then(function (collections) {
          resolve(collections);
        }, function (error) {
          reject(error);
        });
      }, function (error) {
        reject(error);
      });
    },
    afterModel: function afterModel() {
      window.NProgress.done();
    },
    setupController: function setupController(controller, model) {
      var cityService = this.get('cityService');
      var currentCity = cityService.current;

      controller.set('collections', model);
      controller.set('cities', cityService.cities);
      controller.set('cityName', currentCity.name);
      controller.set('citySlug', currentCity.slug);
    }

  });

});
define('dine/routes/city/collections/restaurants/restaurant', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		setupController: function setupController(controller, model) {
			this._super.apply(this, arguments);
			var bannerData = {
				feature: 'smart banner',
				data: {
					'restaurantId': model["id"]
				}
			};
			controller.set("bannerData", bannerData);
		}
	});

});
define('dine/routes/city/collections/restaurants', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    cityService: Ember['default'].inject.service('city'),
    activate: function activate() {
      Ember['default'].$('body').removeClass('section-restaurant-landing').removeClass('section-restaurant').removeClass('js-restaurant-page').addClass('section-map-app').addClass('sticky-map').addClass('js-dine-in-app');
      Ember['default'].$('.wave.dine').hide();
      Ember['default'].$('footer').hide();
      Ember['default'].$('.js-loading-indicator').addClass('hidden');
      Ember['default'].$('.js-content-toggle').removeClass('hidden');
    },
    deactivate: function deactivate() {},
    beforeModel: function beforeModel(transition) {
      window.NProgress.start();

      var self = this;
      var params = transition.params['city.collections'];
      var cityService = self.get('cityService');
      var citySlug = params.citySlug;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var cities = self.modelFor('city');
        var city = cities.findBy('slug', citySlug);

        if (!cityService.current.id || cityService.current.slug !== city.slug) {
          cityService.addCurrent(city);
        }

        resolve(city);
      }, function (error) {
        reject(error);
      });
    },
    model: function model(params) {
      var self = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        self.get('cityService').getCollections().then(function (collections) {
          var collection = collections.findBy('slug', params.collectionSlug);
          resolve(collection);
        }, function (error) {
          reject(error);
        });
      }, function (error) {
        reject(error);
      });
    },
    afterModel: function afterModel() {
      window.NProgress.done();
    },
    setupController: function setupController(controller, model) {
      var cityService = this.get('cityService');
      var currentCity = cityService.current;

      var restaurantsForMap = model.restaurants.sortBy('title');

      //limit to the ones shown on the left view
      //the initial page size is 20
      restaurantsForMap = restaurantsForMap.slice(0, 20);

      controller.set('collection', model);
      controller.set('restaurants', restaurantsForMap);
      controller.set('cities', cityService.cities);
      controller.set('cityName', currentCity.name);
      controller.set('citySlug', currentCity.slug);
      var bannerData = {
        feature: 'smart banner',
        data: {
          'collectionId': model["id"]
        }
      };
      controller.set("bannerData", bannerData);
    }
  });

});
define('dine/routes/city/collections', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('dine/routes/city/index', ['exports', 'ember', 'dine/routes/city'], function (exports, Ember, CityRoute) {

	'use strict';

	exports['default'] = CityRoute['default'].extend({});

});
define('dine/routes/city/restaurant', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    cityService: Ember['default'].inject.service('city'),
    activate: function activate() {
      Ember['default'].$('body').removeClass('section-restaurant-landing').removeClass('section-map-app').removeClass('js-dine-in-app').removeClass('sticky').removeClass('sticky-map').addClass('section-restaurant').addClass('js-restaurant-page');
      Ember['default'].$('.wave.dine').hide();
      Ember['default'].$('footer').show();
      Ember['default'].$('.js-loading-indicator').addClass('hidden');
      Ember['default'].$('.js-content-toggle').removeClass('hidden');
    },
    deactivate: function deactivate() {},
    beforeModel: function beforeModel(transition) {
      window.NProgress.start();

      var self = this;
      var params = transition.params['city.restaurant'];
      var cityService = self.get('cityService');
      var citySlug = params.citySlug;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var cities = self.modelFor('city');
        var city = cities.findBy('slug', citySlug);

        if (!cityService.current.id || cityService.current.slug !== city.slug) {
          cityService.addCurrent(city);
        }

        resolve(city);
      }, function (error) {
        reject(error);
      });
    },
    model: function model(params) {
      var self = this;
      var restaurantSlug = params.restaurantSlug;
      var restaurantID = restaurantSlug.replace(/^.*\-(.*)$/, '$1');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        self.get('cityService').getRestaurant(restaurantID).then(function (restaurant) {
          if (restaurant) {
            resolve(restaurant);
          } else {
            reject('Restaurant ' + restaurantSlug + ' not found.');
          }
        }, function (error) {
          reject(error);
        });
      });
    },
    afterModel: function afterModel() {
      window.NProgress.done();
    },
    setupController: function setupController(controller, model) {
      var restaurant = model;
      var cityService = this.get('cityService');
      var currentCity = cityService.current;

      var neighborhoodSlug = restaurant.neighborhoodSlug;
      var currentNeighborhoods = currentCity.neighborhoods || [];
      var neighborhood = currentNeighborhoods.findBy('slug', neighborhoodSlug);
      var neighborhoodName = neighborhood && neighborhood.name;
      var hasOpenHours = false;
      var instagramHandle = null;

      if (restaurant.openHours) {
        hasOpenHours = Object.keys(restaurant.openHours).length > 0;
      }

      if (restaurant.imagesArray.length > 0) {
        instagramHandle = restaurant.imagesArray[0].source;
      }

      controller.set('restaurant', restaurant);
      controller.set('cityName', currentCity.name);
      controller.set('citySlug', currentCity.slug);
      controller.set('neighborhoodName', neighborhoodName);
      controller.set('neighborhoodSlug', neighborhoodSlug);
      controller.set('hasOpenHours', hasOpenHours);
      controller.set('tags', restaurant.tags.split(',').map(function (t) {
        return t.trim();
      }).sort());
      controller.set('dishes', restaurant.dishes.split(',').map(function (d) {
        return d.trim();
      }));
      controller.set('instagramHandle', instagramHandle);
      controller.set('mapEntries', [{
        estName: restaurant.title,
        address: restaurant.address,
        geoLocation: restaurant.geoLocation,
        icon: 'http://staticcdn11.tastingtable.com/v_2016/images/map-pin.png',
        estUrl: restaurant.menuURL || restaurant.opentableLink,
        estStreet: restaurant.address,
        estCity: restaurant.city.name,
        estState: restaurant.city.state,
        estZip: restaurant.zip,
        estPhone: restaurant.phone
      }]);
      var bannerData = {
        feature: 'smart banner',
        data: {
          'restaurantId': model["id"]
        }
      };
      controller.set("bannerData", bannerData);
      var targeting = [{ key: "City", value: currentCity.id }, { key: "ID", value: restaurant.id }];
      if (!Em.isEmpty(currentCity.collections)) {
        targeting.push({ key: "Section", value: currentCity.collections[0].id });
      }
      controller.set("targeting", targeting);
    }
  });

});
define('dine/routes/city/restaurants-with-features', ['exports', 'dine/routes/city/restaurants'], function (exports, CityRestaurantsRoute) {

	'use strict';

	exports['default'] = CityRestaurantsRoute['default'].extend({
		controllerName: "city/restaurants",
		templateName: "city/restaurants"
		// renderTemplate() {
		//    	this.render('city.restaurants');
		//  	}
	});

});
define('dine/routes/city/restaurants', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    cityService: Ember['default'].inject.service('city'),
    activate: function activate() {
      Ember['default'].$('body').removeClass('section-restaurant-landing').removeClass('section-restaurant').removeClass('js-restaurant-page').addClass('section-map-app').addClass('sticky-map').addClass('js-dine-in-app');
      Ember['default'].$('.wave.dine').hide();
      Ember['default'].$('footer').hide();
    },
    deactivate: function deactivate() {
      Ember['default'].$('body').removeClass('section-map-app').removeClass('js-dine-in-app').removeClass('section-restaurant').removeClass('js-restaurant-page').removeClass('sticky').removeClass('sticky-map').addClass('section-restaurant-landing');
      Ember['default'].$('.wave.dine').show();
      Ember['default'].$('footer').show();
    },
    beforeModel: function beforeModel(transition) {
      window.NProgress.start();

      var self = this;
      var params = transition.params['city.restaurants'] || transition.params['city.restaurantsWithFeatures'];
      var cityService = self.get('cityService');
      var citySlug = params.citySlug || cityService.current.slug;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var cities = self.modelFor('city');
        var city = cities.findBy('slug', citySlug);

        if (!cityService.current.id || cityService.current.slug !== city.slug) {
          cityService.addCurrent(city);
        }

        resolve(city);
      }, function (error) {
        reject(error);
      });
    },
    model: function model(params) {
      var self = this;
      var cityService = this.get('cityService');
      var neighborhoodSlug = params.neighborhoodSlug || 'all';
      var cuisineSlug = params.cuisineSlug || 'all';
      var featureSlug = params.featureSlug || 'all';

      self.controllerFor('city.restaurants').setProperties({
        'neighborhoodSlug': neighborhoodSlug,
        'cuisineSlug': cuisineSlug,
        'featureSlug': featureSlug
      });

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        cityService.getRestaurants(neighborhoodSlug, cuisineSlug, featureSlug).then(function (restaurants) {
          cityService.getNeighborhoods(false).then(function () {
            cityService.getCuisinesBy(neighborhoodSlug, false).then(function () {
              cityService.getFeaturesBy(neighborhoodSlug, cuisineSlug, false).then(function () {
                cityService.addToCache();
                resolve(restaurants);
              });
            });
          }, function (error) {
            reject(error);
          });
        }, function (error) {
          reject(error);
        });
      });
    },
    afterModel: function afterModel() {
      window.NProgress.done();
    },
    serialize: function serialize(model) {
      //if a model has been passed directly i.e. via transitionTo when using search,
      //then specify url dynamic segments
      return {
        citySlug: this.get("cityService").current.slug,
        neighborhoodSlug: "all",
        cuisineSlug: "all",
        featureSlug: "all"
      };
    },
    setupController: function setupController(controller, model, transition) {
      controller = this.controllerFor('city.restaurants');

      var cityService = this.get('cityService');
      var currentCity = cityService.current;

      var neighborhoodSlug = controller.get('neighborhoodSlug');
      var cuisineSlug = controller.get('cuisineSlug');
      var featureSlug = controller.get('featureSlug');

      var currentNeighborhoods = currentCity.neighborhoods || [];
      var currentCuisines = currentCity.cuisinesByNeighborhood[neighborhoodSlug] || [];
      var featuresByNeighborhoodAndCuisine = currentCity.featuresByNeighborhoodAndCuisine[neighborhoodSlug] || {};
      var currentFeatures = featuresByNeighborhoodAndCuisine[cuisineSlug] || [];

      var neighborhood = currentNeighborhoods.findBy('slug', neighborhoodSlug);
      var cuisine = currentCuisines.findBy('slug', cuisineSlug);
      var feature = currentFeatures.findBy('slug', featureSlug);

      var neighborhoodName = neighborhood && neighborhood.name;
      var cuisineName = cuisine && cuisine.name;
      var featureName = feature && feature.name;

      var restaurants = model;
      var restaurantsForMap = restaurants;

      //limit to the ones shown on the left view
      //the initial page size is 20
      restaurantsForMap = restaurants.slice(0, 20);
      // if (neighborhoodSlug === 'all' && cuisineSlug === 'all' && featureSlug === 'all') {
      // restaurantsForMap = restaurants.slice(0, 10);
      // }

      controller.set('restaurants', restaurants);
      controller.set('restaurantsForMap', restaurantsForMap);
      controller.set('cities', cityService.cities);
      controller.set('cityName', currentCity.name);
      controller.set('citySlug', currentCity.slug);
      controller.set('neighborhoodLabel', neighborhoodName || 'Neighborhood');
      controller.set('cuisineLabel', cuisineName || 'Cuisine');
      controller.set('featureLabel', featureName || 'Feature');
      controller.set('neighborhoods', currentNeighborhoods);
      controller.set('cuisines', currentCuisines);
      controller.set('features', currentFeatures);

      if (!Em.isEmpty(transition.queryParams["q"])) {
        var searchQuery = transition.queryParams["q"].trim();
        this.get("cityService").searchRestaurants(searchQuery, restaurants, function (matchedRestaurants) {
          controller.set("restaurants", matchedRestaurants);
          var restaurantsForMap = matchedRestaurants.slice(0, 10);
          controller.set('restaurantsForMap', restaurantsForMap);
        });
      } else {
        Em.run.next(function () {
          controller.set("searchQuery", null);
        });
      }
    }
  });

});
define('dine/routes/city', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    cityService: Ember['default'].inject.service('city'),
    collectionsByCity: {},
    activate: function activate() {
      Ember['default'].$('body').removeClass('section-map-app').removeClass('js-dine-in-app').removeClass('section-restaurant').removeClass('js-restaurant-page').removeClass('sticky').removeClass('sticky-map').addClass('section-restaurant-landing');
      Ember['default'].$('.wave.dine').show();
      Ember['default'].$('footer').show();
    },
    deactivate: function deactivate() {},
    beforeModel: function beforeModel() {
      window.NProgress.start();
    },
    model: function model() {
      var self = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        self.get('cityService').getCities().then(function (cities) {
          self.set('cities', cities);

          if (!self.get('cityService').current.id) {
            var city = cities.findBy('slug', 'new-york');
            self.get('cityService').addCurrent(city);
          }

          self.getCollections().then(function () {
            resolve(cities);
          }, function (error) {
            reject(error);
          });
        }, function (error) {
          reject(error);
        });
      });
    },
    afterModel: function afterModel() {
      window.NProgress.done();
    },
    getCollections: function getCollections() {
      var self = this;
      var cityService = this.get('cityService');
      var collectionsByCity = this.get('collectionsByCity');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        cityService.getCollections().then(function (collections) {
          collectionsByCity[cityService.current.id] = collections;
          // if (self.controller) {
          //   self.controller.set('collections', collections);
          // } else {
          self.controllerFor('city.index').set('collections', collections);
          // }

          resolve(collections);
        }, function (error) {
          reject(error);
        });
      });
    },
    setupController: function setupController(controller, model) {
      var cityService = this.get('cityService');
      var citySlug = cityService.current.slug;

      controller.set('cities', model);
      controller.set('cuisines', null);
      controller.set('neighborhoods', null);

      this.neighborhoodsRequest(citySlug);
    },
    neighborhoodsRequest: function neighborhoodsRequest(citySlug) {
      var _this = this;

      var self = this;
      var city = this.get('cities').findBy('slug', citySlug);
      var cityService = this.get('cityService');

      if (!cityService.current.id || cityService.current.slug !== city.slug) {
        cityService.addCurrent(city);
      }

      this.getCollections().then(function () {
        cityService.getNeighborhoods().then(function (neighborhoods) {
          // if (self.controller) {
          //   self.controller.set('neighborhoods', neighborhoods);
          // } else {
          self.controllerFor('city.index').set('neighborhoods', neighborhoods);
          // }
        });
        _this.send("getCuisines", "all");
      });
    },
    actions: {
      getNeighborhoods: function getNeighborhoods(citySlug) {
        this.neighborhoodsRequest(citySlug);
      },
      getCuisines: function getCuisines(neighborhoodSlug) {
        var self = this;

        this.get('cityService').getCuisinesBy(neighborhoodSlug).then(function (cuisines) {
          // if (self.controller) {
          //   self.controller.set('cuisines', cuisines);
          // } else {
          self.controllerFor('city.index').set('cuisines', cuisines);
          // }
        });
      }
    }
  });

});
define('dine/routes/updates/city', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    cityService: Ember['default'].inject.service('city'),
    beforeModel: function beforeModel() {
      window.NProgress.start();

      var cities = JSON.parse(window.sessionStorage.getItem('cities'));

      if (cities) {
        this.set('cities', cities);
        return cities;
      } else {
        return new Ember['default'].RSVP.Promise(function (resolve, reject) {
          // Query city from Parse API using slug to get it's ID
          var City = window.Parse.Object.extend("City");
          var cityQuery = new window.Parse.Query(City);
          cityQuery.ascending("order");
          cityQuery.find({
            success: function success(results) {
              var cities = [];
              results.forEach(function (city) {
                var cityTitle = city.get('title').trim();
                var citySlug = window.getSlug(cityTitle);
                cities.push({
                  id: city.id,
                  title: cityTitle,
                  slug: citySlug,
                  timeZone: city.get('timeZone'),
                  timeZoneAbbreviation: city.get('timeZoneAbbreviation'),
                  state: city.get('state'),
                  order: city.get('order'),
                  numberOfRestaurants: city.get('numberOfRestaurants'),
                  geoLocation: city.get('geoLocation')
                });
              });

              window.sessionStorage.setItem('cities', window.JSON.stringify(cities));
              this.set('cities', cities);
              resolve(cities);
            }, error: function error(_error) {
              reject(_error);
            }
          });
        });
      }
    },
    model: function model(params) {
      var cityService = this.get('cityService');

      var city = this.get('cities').findBy('slug', params.citySlug);
      if (cityService.slug !== params.citySlug) {
        cityService.addCurrent(city);
      }

      if (cityService.updates.length > 0) {
        return cityService.updates;
      } else {
        return new Ember['default'].RSVP.Promise(function (resolve, reject) {
          var cityId = city.id;
          var updates = [];

          var City = window.Parse.Object.extend("City");
          var cityQuery = new window.Parse.Query(City);
          cityQuery.equalTo('objectId', cityId);

          var Newsfeed = window.Parse.Object.extend("Newsfeed");
          var query = new window.Parse.Query(Newsfeed);
          query.matchesQuery('city', cityQuery);
          query.equalTo('isActive', true);
          query.containedIn('cardType', [0, 1]); // 0 = Restaurant | 1 = Collection
          query.descending('publishDate');
          query.include('collection');
          query.include('restaurant');
          query.find({
            success: function success(results) {
              results.forEach(function (update) {
                var cardType = null;

                switch (update.get('cardType')) {
                  case 0:
                    cardType = 'restaurant';
                    break;
                  case 1:
                    cardType = 'collection';
                    break;
                }

                updates.push({
                  id: update.id,
                  city: city,
                  cityID: city.id,
                  citySlug: city.slug,
                  type: cardType,
                  title: update.get('title').trim(),
                  body: update.get('cardBody').trim(),
                  header: update.get('cardHeader').trim(),
                  subheader: update.get('cardSubheader').trim(),
                  subheader2: update.get('cardSubheader2').trim(),
                  collection: update.get('collection'),
                  collectionID: update.get('collection') && update.get('collection').id,
                  collectionName: update.get('collection') && update.get('collection').get('title').trim(),
                  collectionSlug: update.get('collection') && window.getSlug(update.get('collection').get('title').trim()),
                  imageURL: update.get('image'),
                  nativeURL: update.get('nativeURL'),
                  publishDate: update.get('publishDate'),
                  restaurant: update.get('restaurant'),
                  restaurantID: update.get('restaurant') && update.get('restaurant').id,
                  restaurantName: update.get('restaurant') && update.get('restaurant').get('title').trim(),
                  restaurantSlug: update.get('restaurant') && window.getSlug(update.get('restaurant').get('title').trim()),
                  whatHappened: update.get('whatHappened'),
                  isCollection: cardType === 'collection'
                });
              });

              cityService.set('updates', updates);
              resolve(updates);
            }, error: function error(_error2) {
              reject(_error2);
            }
          });
        });
      }
    },
    afterModel: function afterModel() {
      window.NProgress.done();
    }
  });

});
define('dine/routes/updates', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    cityService: Ember['default'].inject.service('city'),
    beforeModel: function beforeModel() {
      window.NProgress.start();

      var cityService = this.get('cityService');

      if (cityService.get('hasCity')) {
        this.transitionTo('updates.city', cityService.slug);
      }
    },
    model: function model() {
      var cityService = this.get('cityService');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        cityService.getCities().then(function (cities) {
          resolve(cities);
        }, function (error) {
          reject(error);
        });
      });
    },
    afterModel: function afterModel() {
      window.NProgress.done();
    }
  });

});
define('dine/services/api', ['exports', 'ember', 'dine/config/environment'], function (exports, Ember, ENV) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    cache: {
      cities: [],
      collectionsByCity: {},
      neighborhoodsByCity: {},
      cuisinesByCityAndNeighborhood: {},
      featuresByCityAndNeighborhoodAndCuisine: {},
      restaurantsByCityAndNeighborhoodAndCuisineAndFeature: {},
      restaurants: {}
    },
    url: ENV['default'].APP.API_URL,
    version: 'v1',
    getCities: function getCities() {
      var _this = this;

      var self = this;
      var cache = this.get('cache');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cache.cities.length > 0) {
          resolve(cache.cities);
        } else {
          self.getData('cities').then(function (data) {
            cache.cities = data;
            _this.set('cache', cache);
            resolve(data);
          }, function (jqxhr, status, error) {
            reject(error);
          });
        }
      });
    },
    getNeighborhoods: function getNeighborhoods(cityID) {
      var _this2 = this;

      var self = this;
      var cache = this.get('cache');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cache.neighborhoodsByCity[cityID] && cache.neighborhoodsByCity[cityID].length > 0) {
          resolve(cache.neighborhoodsByCity[cityID]);
        } else {
          self.getData('cities/' + cityID + '/neighborhoods').then(function (data) {
            cache.neighborhoodsByCity[cityID] = data;
            _this2.set('cache', cache);
            resolve(data);
          }, function (jqxhr, status, error) {
            reject(error);
          });
        }
      });
    },
    getCuisines: function getCuisines(cityID, neighborhoodSlug) {
      var _this3 = this;

      var self = this;
      var cache = this.get('cache');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cache.cuisinesByCityAndNeighborhood[cityID] && cache.cuisinesByCityAndNeighborhood[cityID][neighborhoodSlug] && cache.cuisinesByCityAndNeighborhood[cityID][neighborhoodSlug].length > 0) {
          resolve(cache.cuisinesByCityAndNeighborhood[cityID][neighborhoodSlug]);
        } else {
          self.getData('cities/' + cityID + '/neighborhoods/' + neighborhoodSlug + '/cuisines').then(function (data) {
            cache.cuisinesByCityAndNeighborhood[cityID] = cache.cuisinesByCityAndNeighborhood[cityID] || {};
            cache.cuisinesByCityAndNeighborhood[cityID][neighborhoodSlug] = data;

            _this3.set('cache', cache);

            resolve(data);
          }, function (jqxhr, status, error) {
            reject(error);
          });
        }
      });
    },
    getFeatures: function getFeatures(cityID, neighborhoodSlug, cuisineSlug) {
      var _this4 = this;

      var self = this;
      var cache = this.get('cache');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cache.featuresByCityAndNeighborhoodAndCuisine[cityID] && cache.featuresByCityAndNeighborhoodAndCuisine[cityID][neighborhoodSlug] && cache.featuresByCityAndNeighborhoodAndCuisine[cityID][neighborhoodSlug][cuisineSlug] && cache.featuresByCityAndNeighborhoodAndCuisine[cityID][neighborhoodSlug][cuisineSlug].length > 0) {
          resolve(cache.featuresByCityAndNeighborhoodAndCuisine[cityID][neighborhoodSlug][cuisineSlug]);
        } else {
          self.getData('cities/' + cityID + '/neighborhoods/' + neighborhoodSlug + '/cuisines/' + cuisineSlug + '/features').then(function (data) {
            cache.featuresByCityAndNeighborhoodAndCuisine[cityID] = cache.featuresByCityAndNeighborhoodAndCuisine[cityID] || {};
            cache.featuresByCityAndNeighborhoodAndCuisine[cityID][neighborhoodSlug] = cache.featuresByCityAndNeighborhoodAndCuisine[cityID][neighborhoodSlug] || {};
            cache.featuresByCityAndNeighborhoodAndCuisine[cityID][neighborhoodSlug][cuisineSlug] = data;
            _this4.set('cache', cache);

            resolve(data);
          }, function (jqxhr, status, error) {
            reject(error);
          });
        }
      });
    },
    getRestaurants: function getRestaurants(cityID, neighborhoodSlug, cuisineSlug, featureSlug) {
      var _this5 = this;

      var self = this;
      var cache = this.get('cache');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID] && cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug] && cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug][cuisineSlug] && cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug][cuisineSlug][featureSlug] && cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug][cuisineSlug][featureSlug].length > 0) {
          resolve(cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug][cuisineSlug][featureSlug]);
        } else {
          self.getData('cities/' + cityID + '/neighborhoods/' + neighborhoodSlug + '/cuisines/' + cuisineSlug + '/features/' + featureSlug + '/restaurants').then(function (data) {
            cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID] = cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID] || {};
            cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug] = cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug] || {};
            cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug][cuisineSlug] = cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug][cuisineSlug] || {};
            cache.restaurantsByCityAndNeighborhoodAndCuisineAndFeature[cityID][neighborhoodSlug][cuisineSlug][featureSlug] = data;

            _this5.set('cache', cache);

            resolve(data);
          }, function (jqxhr, status, error) {
            reject(error);
          });
        }
      });
    },
    getRestaurant: function getRestaurant(cityID, id) {
      var _this6 = this;

      var self = this;
      var cache = this.get('cache');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cache.restaurants[id]) {
          resolve(cache.restaurants[id]);
        } else {
          self.getData('cities/' + cityID + '/restaurants/' + id).then(function (data) {
            cache.restaurants[id] = data;

            _this6.set('cache', cache);

            resolve(data);
          }, function (jqxhr, status, error) {
            reject(error);
          });
        }
      });
    },
    getCollections: function getCollections(cityID) {
      var _this7 = this;

      var self = this;
      var cache = this.get('cache');

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cache.collectionsByCity[cityID]) {
          resolve(cache.collectionsByCity[cityID]);
        } else {
          self.getData('cities/' + cityID + '/collections').then(function (data) {
            cache.collectionsByCity[cityID] = data;

            _this7.set('cache', cache);

            resolve(data);
          }, function (jqxhr, status, error) {
            reject(error);
          });
        }
      });
    },
    getData: function getData(path) {
      var url = this.get('url');
      var version = this.get('version');

      return window.$.getJSON(url + '/' + version + '/' + path);
    }
  });

});
define('dine/services/branch-metrics', ['exports', 'ember', 'dine/config/environment'], function (exports, Ember, ENV) {

    'use strict';

    /*
    This service accommodates the functionality provided by Branch Metrics Web SDK.
    */
    exports['default'] = Ember['default'].Service.extend({
        branch: null,
        doNotShow: false,
        constants: Em.inject.service(),
        bannerDefaultOptions: (function () {
            var self = this;
            var theOptions = {
                // icon: 'http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Appstore-icon.png',
                icon: (ENV['default'].baseURL || self.get("constants.staticS3Url") + "/dist/") + 'assets/images/dine-icon.png',
                title: "DINE by Tasting Table",
                description: "Send yourself a link to discover your city's best restaurants",
                downloadAppButtonText: "Download",
                // forgetHide: false,
                forgetHide: 1,
                mobileSticky: true,
                showAndroid: false,
                customCSS: '#branch-banner .content{background-color:rgba(230, 230, 230, 0.97)}'
            };
            return theOptions;
        }).property(),
        bannerDefaultData: {},
        init: function init() {
            this.resetSmartBanner();
            this.initBranchMetrics();

            return this._super.apply(this, arguments);
        },
        initBranchMetrics: function initBranchMetrics() {
            var self = this;
            (function (b, r, a, n, c, h, _, s, d, k) {
                if (!b[n] || !b[n]._q) {
                    for (; s < _.length;) c(h, _[s++]);d = r.createElement(a);d.async = 1;d.src = "https://cdn.branch.io/branch-v1.8.8.min.js";k = r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d, k);b[n] = h;
                }
            })(window, document, "script", "branch", function (b, r) {
                b[r] = function () {
                    b._q.push([r, arguments]);
                };
            }, { _q: [], _v: 1 }, "addListener applyCode banner closeBanner creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setIdentity track validateCode".split(" "), 0);

            // Note that this example is using the key in two places, here and below
            branch.init(ENV['default'].APP.BRANCH_METRICS_KEY, function (err, data) {
                self.set("branch", branch);
            });
            self.set("branch", branch);
        },
        resetSmartBanner: function resetSmartBanner() {
            var isInitialized = sessionStorage.getItem("branchMetricsSmartBannerInit");
            if (Em.isEmpty(isInitialized) || !isNaN(parseInt(this.get("bannerDefaultOptions.forgetHide")))) {

                //if property forgetHide is not using a number then just remove it
                if (isNaN(parseInt(this.get("bannerDefaultOptions.forgetHide")))) {
                    this._allowShowingBanner();
                } else {
                    //if property forgetHide is a number, then it represents days
                    var untilDate = localStorage.getItem("BRANCH_WEBSDK_KEYhideBanner");
                    if (!Em.isEmpty(untilDate)) {
                        untilDate = parseInt(untilDate);
                        if (Date.now() >= untilDate) {
                            this._allowShowingBanner();
                        } else {
                            this.set("doNotShow", true);
                        }
                    }
                }
                sessionStorage.setItem("branchMetricsSmartBannerInit", 1);
            }
        },
        showSmartAppBanner: function showSmartAppBanner(options, data) {
            //if doNotShow is set to true, then don't bother smart banner will not allow
            //due to forgetHide status
            if (!this.get("doNotShow")) {
                var debounceDelay = 1000;
                if ($("#branch-banner-iframe").length !== 0) {
                    Em.run.debounce(this, this._closeBanner, options, data, debounceDelay);
                } else {
                    //by default if showing has been called more than once,
                    //then the first call gets rendered
                    Em.run.debounce(this, this._showBanner, options, data, debounceDelay);
                }
            }
        },
        _closeBanner: function _closeBanner(options, data) {
            var self = this;
            //by default if the banner does not finish closing,
            //then it does not show, so a listener is required
            var didCloseBannerListener = function didCloseBannerListener(event) {
                self._showBanner(options, data);
                self.get("branch").removeListener(didCloseBannerListener);
            };
            self.get("branch").addListener("didCloseBanner", didCloseBannerListener);
            branch.closeBanner();
            //remove the hide banner flag for remembering, if closed by this action
            //so that it shows again
            //this close action is used to change banners as we navigate
            this._allowShowingBanner();
        },
        _showBanner: function _showBanner(options, data) {
            var defaultOptions = this.get("bannerDefaultOptions");
            var defaultData = this.get("bannerDefaultData");
            var mergedOptions = Em.merge(defaultOptions, options);
            var mergedData = Em.merge(defaultData, data);
            branch.banner(mergedOptions, mergedData);
        },
        _allowShowingBanner: function _allowShowingBanner() {
            localStorage.removeItem("BRANCH_WEBSDK_KEYhideBanner");
            this.set("doNotShow", false);
        }
    });

});
define('dine/services/city', ['exports', 'ember', 'dine/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    api: Ember['default'].inject.service('api'),
    cache: {},
    cities: [],
    searchClient: null,
    current: {
      collections: [],
      cuisinesByNeighborhood: {},
      featuresByNeighborhoodAndCuisine: {},
      geoLocation: {},
      id: null,
      name: null,
      neighborhoods: [],
      slug: null,
      state: null,
      updates: []
    },
    hasCity: Ember['default'].computed.notEmpty('current.id'),
    shouldGetClosestCity: true,
    addToCache: (function () {
      this._saveOnCache('currentCity', this.get('current'));
    }).observes('current'),
    init: function init() {
      this._super.apply(this, arguments);
      var cities = this._getFromCache('cities');
      var currentCity = this._getFromCache('currentCity');

      if (currentCity) {
        this.addCurrent(currentCity);
      }

      if (cities && cities.length > 0) {
        this.set('cities', cities);
      }
    },
    addCurrent: function addCurrent(city, save) {
      this.set('current', {
        id: city.id,
        name: city.title || city.name,
        slug: city.slug,
        geoLocation: city.geoLocation,
        collections: city.collections || [],
        cuisinesByNeighborhood: city.cuisinesByNeighborhood || {},
        featuresByNeighborhoodAndCuisine: city.featuresByNeighborhoodAndCuisine || {},
        neighborhoods: city.neighborhoods || [],
        state: city.state,
        updates: city.updates || []
      });

      if (save === undefined || save === null || save === true) {
        this.addToCache();
      }
    },
    getCities: function getCities() {
      var _this = this;

      var self = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var cities = self.get('cities');

        if (cities.length > 0) {
          resolve(cities);
        } else {
          _this.get('api').getCities().then(function (cities) {
            self._saveOnCache('cities', cities);
            self.set('cities', cities);
            resolve(cities);
          }, function (error) {
            reject(error);
          });
        }
      });
    },
    getRestaurants: function getRestaurants(neighborhoodSlug, cuisineSlug, featureSlug) {
      var _this2 = this;

      var self = this;
      var current = self.get('current');
      var cityID = current.id;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        _this2.get('api').getRestaurants(cityID, neighborhoodSlug, cuisineSlug, featureSlug).then(function (restaurants) {
          resolve(restaurants);
        }, function (error) {
          reject(error);
        });
      });
    },
    getRestaurant: function getRestaurant(id) {
      var _this3 = this;

      var self = this;
      var current = self.get('current');
      var cityID = current.id;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        _this3.get('api').getRestaurant(cityID, id).then(function (restaurant) {
          resolve(restaurant);
        }, function (error) {
          reject(error);
        });
      });
    },
    getCollections: function getCollections() {
      var _this4 = this;

      var self = this;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        var current = self.get('current');
        var cityID = current.id;
        var collections = current.collections;

        if (collections.length > 0) {
          resolve(collections);
        } else {
          _this4.get('api').getCollections(cityID).then(function (collections) {
            current.collections = collections;
            self.addCurrent(current);
            resolve(collections);
          }, function (error) {
            reject(error);
          });
        }
      });
    },
    getNeighborhoods: function getNeighborhoods(save) {
      var self = this;
      var current = this.get('current');
      var cityID = current.id;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        self.get('api').getNeighborhoods(cityID).then(function (neighborhoods) {
          current.neighborhoods = neighborhoods;
          self.addCurrent(current, save);
          resolve(current.neighborhoods);
        }, function (error) {
          reject(error);
        });
      });
    },
    getCuisinesBy: function getCuisinesBy(neighborhoodSlug, save) {
      var _this5 = this;

      var self = this;
      var current = this.get('current');
      var cityID = current.id;
      var cuisinesByNeighborhood = current.cuisinesByNeighborhood;

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (cuisinesByNeighborhood[neighborhoodSlug] && cuisinesByNeighborhood[neighborhoodSlug].length > 0) {
          resolve(cuisinesByNeighborhood[neighborhoodSlug]);
        } else {
          self.get('api').getCuisines(cityID, neighborhoodSlug).then(function (cuisines) {
            cuisinesByNeighborhood[neighborhoodSlug] = cuisines;
            current.cuisinesByNeighborhood = cuisinesByNeighborhood;
            _this5.addCurrent(current, save);

            resolve(cuisines);
          }, function (error) {
            reject(error);
          });
        }
      });
    },
    getFeaturesBy: function getFeaturesBy(neighborhoodSlug, cuisineSlug, save) {
      var _this6 = this;

      var self = this;
      var current = this.get('current');
      var cityID = current.id;
      var currentFeatures = current.featuresByNeighborhoodAndCuisine;

      currentFeatures[neighborhoodSlug] = currentFeatures[neighborhoodSlug] || {};

      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        if (currentFeatures[neighborhoodSlug][cuisineSlug] && currentFeatures[neighborhoodSlug][cuisineSlug].length > 0) {
          resolve(currentFeatures[neighborhoodSlug][cuisineSlug]);
        } else {
          self.get('api').getFeatures(cityID, neighborhoodSlug, cuisineSlug).then(function (features) {
            currentFeatures[neighborhoodSlug][cuisineSlug] = features;
            current.featuresByNeighborhoodAndCuisine = currentFeatures;
            _this6.addCurrent(current, save);

            resolve(features);
          }, function (error) {
            reject(error);
          });
        }
      });
    },
    searchRestaurants: function searchRestaurants(searchQuery, allRestaurantsData, callback) {
      var algoliaClient = this.get("searchClient");
      if (Em.isEmpty(algoliaClient)) {
        algoliaClient = window.algoliasearch(config['default'].APP.Algolia.applicationId, config['default'].APP.Algolia.searchOnlyAPIKey);
        this.set("searchClient", algoliaClient);
      }
      var algoliaIndex = algoliaClient.initIndex('Restaurants - ' + this.get('current.name'));
      this.set("searchIndex", algoliaIndex);

      var searchIndex = this.get("searchIndex");
      var restaurants = [];
      var self = this;
      if (!Em.isEmpty(searchQuery)) {
        searchIndex.search(searchQuery, { hitsPerPage: 1000 }, function (err, content) {
          if (err) {
            console.error(err);
            callback(restaurants);
            return;
          }
          var restaurantObjects = content.hits;
          if (!Em.isEmpty(restaurantObjects)) {
            //find each restaurant object from all restaurants
            if (!Em.isEmpty(allRestaurantsData)) {
              restaurantObjects.forEach(function (restaurantObject) {
                var restaurantFound = allRestaurantsData.findBy("id", restaurantObject["id"]);
                if (!Em.isEmpty(restaurantFound)) {
                  restaurants.push(restaurantFound);
                }
              });
              callback(restaurants);
            } else {
              self.getRestaurants("all", "all", "all").then(function (allRestaurants) {
                restaurantObjects.forEach(function (restaurantObject) {
                  restaurants.push(allRestaurants.findBy("id", restaurantObject["id"]));
                });
                callback(restaurants);
              }, function (error) {
                console.log(error);
                callback(restaurants);
              });
            }
          } else {
            callback(restaurants);
          }
        });
      } else {
        self.getRestaurants("all", "all", "all").then(function (allRestaurants) {
          callback(allRestaurants);
        }, function (error) {
          console.log(error);
          callback(restaurants);
        });
      }
    },
    _saveOnCache: function _saveOnCache(key, data) {
      this.get('cache')[key] = data;
    },
    _getFromCache: function _getFromCache(key) {
      return this.get('cache')[key] || null;
    }
  });

});
define('dine/services/constants', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    staticS3Url: window.staticS3Url
  });

});
define('dine/services/dfp', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	/*
	This service provides DFP functionality.
	It defines all available add slots, to be called later on by specific views.
	The component that takes care of calling a DFP ad, is the "dfp-ad" component
	*/
	exports['default'] = Ember['default'].Service.extend({
		slots: {},
		slotsDefs: [{
			id: 'div-gpt-ad-1448375439589-0',
			name: '/2575196/New_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-1',
			name: '/2575196/New_300x600',
			width: 300,
			height: 600
		}, {
			id: 'div-gpt-ad-1448375439589-2',
			name: '/2575196/New_10_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-3',
			name: '/2575196/New_11_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-4',
			name: '/2575196/New_12_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-5',
			name: '/2575196/New_13_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-6',
			name: '/2575196/New_14_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-7',
			name: '/2575196/New_15_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-8',
			name: '/2575196/New_16_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-9',
			name: '/2575196/New_2_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-10',
			name: '/2575196/New_3_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-11',
			name: '/2575196/New_4_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-12',
			name: '/2575196/New_5_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-13',
			name: '/2575196/New_6_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-14',
			name: '/2575196/New_7_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-15',
			name: '/2575196/New_8_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-16',
			name: '/2575196/New_9_300x250',
			width: 300,
			height: 250
		}, {
			id: 'div-gpt-ad-1448375439589-17',
			name: '/2575196/Rising_Star_Billboard',
			width: 970,
			height: 250
		}],
		init: function init() {
			this._super.apply(this, arguments);

			this.setupDFP();
			this.defineSlots();
		},
		setupDFP: function setupDFP() {
			var googletag = window.googletag = googletag || {};
			googletag.cmd = googletag.cmd || [];
			(function () {
				var gads = document.createElement('script');
				gads.async = true;
				gads.type = 'text/javascript';
				var useSSL = 'https:' == document.location.protocol;
				gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
				var node = document.getElementsByTagName('script')[0];
				node.parentNode.insertBefore(gads, node);
			})();
		},
		defineSlots: function defineSlots() {
			var self = this;
			var slotsDefs = this.get("slotsDefs");
			var googletag = window.googletag;
			googletag.cmd.push(function () {

				slotsDefs.forEach(function (slotDef) {
					self.get("slots")[slotDef["id"]] = googletag.defineSlot(slotDef["name"], [slotDef["width"], slotDef["height"]], slotDef["id"]).addService(googletag.pubads()).setTargeting("Pagetype", "Restaurants");
				});

				// googletag.pubads().setTargeting("topic","basketball");//for page level targeting for all slots
				googletag.pubads().enableSingleRequest();
				googletag.enableServices();
			});
		}

	});

});
define('dine/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,0],[1,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/city/collections/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "dine/templates/city/collections/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          return morphs;
        },
        statements: [
          ["content","restaurants-map",["loc",[null,[2,0],[2,19]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/collections/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","is-mobile",[],["show",false],0,null,["loc",[null,[1,0],[3,14]]]],
        ["inline","collections-list",[],["city",["subexpr","@mut",[["get","city",["loc",[null,[5,24],[5,28]]]]],[],[]],"cityName",["subexpr","@mut",[["get","cityName",["loc",[null,[6,28],[6,36]]]]],[],[]],"citySlug",["subexpr","@mut",[["get","citySlug",["loc",[null,[7,28],[7,36]]]]],[],[]],"cities",["subexpr","@mut",[["get","cities",["loc",[null,[8,26],[8,32]]]]],[],[]],"resultsKey","collections","collections",["subexpr","@mut",[["get","collections",["loc",[null,[10,31],[10,42]]]]],[],[]]],["loc",[null,[5,0],[10,44]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('dine/templates/city/collections/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/collections/loading.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","loading-indicator",["loc",[null,[1,0],[1,21]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/city/collections/restaurants/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/collections/restaurants/loading.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","loading-indicator",["loc",[null,[1,0],[1,21]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/city/collections/restaurants/restaurant', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/collections/restaurants/restaurant.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","smart-app-banner",[],["bannerData",["subexpr","@mut",[["get","bannerData",["loc",[null,[1,30],[1,40]]]]],[],[]]],["loc",[null,[1,0],[1,42]]]],
        ["content","outlet",["loc",[null,[2,0],[2,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/city/collections/restaurants', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 0
            }
          },
          "moduleName": "dine/templates/city/collections/restaurants.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","restaurants-map",[],["restaurants",["subexpr","@mut",[["get","restaurants",["loc",[null,[3,31],[3,42]]]]],[],[]]],["loc",[null,[3,1],[3,44]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/collections/restaurants.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,4,4,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","smart-app-banner",[],["bannerData",["subexpr","@mut",[["get","bannerData",["loc",[null,[1,30],[1,40]]]]],[],[]]],["loc",[null,[1,0],[1,42]]]],
        ["block","is-mobile",[],["show",false],0,null,["loc",[null,[2,0],[4,14]]]],
        ["inline","collection-restaurants-list",[],["city",["subexpr","@mut",[["get","city",["loc",[null,[6,35],[6,39]]]]],[],[]],"cityName",["subexpr","@mut",[["get","cityName",["loc",[null,[7,39],[7,47]]]]],[],[]],"citySlug",["subexpr","@mut",[["get","citySlug",["loc",[null,[8,39],[8,47]]]]],[],[]],"cities",["subexpr","@mut",[["get","cities",["loc",[null,[9,37],[9,43]]]]],[],[]],"resultsKey","restaurants","restaurants",["subexpr","@mut",[["get","restaurants",["loc",[null,[11,42],[11,53]]]]],[],[]],"collection",["subexpr","@mut",[["get","collection",["loc",[null,[12,41],[12,51]]]]],[],[]]],["loc",[null,[6,0],[12,53]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('dine/templates/city/collections', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 10
          }
        },
        "moduleName": "dine/templates/city/collections.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,0],[1,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/city/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 51
          }
        },
        "moduleName": "dine/templates/city/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["content","smart-app-banner",["loc",[null,[1,0],[1,20]]]],
        ["inline","restaurant-landing",[],["cities",["subexpr","@mut",[["get","cities",["loc",[null,[2,28],[2,34]]]]],[],[]],"neighborhoods",["subexpr","@mut",[["get","neighborhoods",["loc",[null,[3,35],[3,48]]]]],[],[]],"cuisines",["subexpr","@mut",[["get","cuisines",["loc",[null,[4,30],[4,38]]]]],[],[]],"collections",["subexpr","@mut",[["get","collections",["loc",[null,[5,33],[5,44]]]]],[],[]],"neighborhoodsAction","getNeighborhoods","cuisinesAction","getCuisines"],["loc",[null,[2,0],[7,51]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/city/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/loading.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","loading-indicator",["loc",[null,[1,0],[1,21]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/city/restaurant', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 20
            },
            "end": {
              "line": 27,
              "column": 20
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"target","_blank");
          var el2 = dom.createTextNode("website");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element8 = dom.childAt(fragment, [2]);
          var morphs = new Array(1);
          morphs[0] = dom.createAttrMorph(element8, 'href');
          return morphs;
        },
        statements: [
          ["attribute","href",["get","restaurant.website",["loc",[null,[26,38],[26,56]]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 36,
                "column": 22
              },
              "end": {
                "line": 38,
                "column": 22
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                        Mon: ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","restaurant.openHours.mon",["loc",[null,[37,29],[37,57]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 39,
                "column": 22
              },
              "end": {
                "line": 41,
                "column": 22
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                        Tue: ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","restaurant.openHours.tue",["loc",[null,[40,29],[40,57]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child2 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 42,
                "column": 22
              },
              "end": {
                "line": 44,
                "column": 22
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                        Wed: ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","restaurant.openHours.wed",["loc",[null,[43,29],[43,57]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child3 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 45,
                "column": 22
              },
              "end": {
                "line": 47,
                "column": 22
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                        Thu: ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","restaurant.openHours.thu",["loc",[null,[46,29],[46,57]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child4 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 48,
                "column": 22
              },
              "end": {
                "line": 50,
                "column": 22
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                        Fri: ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","restaurant.openHours.fri",["loc",[null,[49,29],[49,57]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child5 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 51,
                "column": 22
              },
              "end": {
                "line": 53,
                "column": 22
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                        Sat: ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","restaurant.openHours.sat",["loc",[null,[52,29],[52,57]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child6 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 54,
                "column": 22
              },
              "end": {
                "line": 56,
                "column": 22
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                        Sun: ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("br");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","restaurant.openHours.sun",["loc",[null,[55,29],[55,57]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 31,
              "column": 16
            },
            "end": {
              "line": 59,
              "column": 16
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","hours");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          var el3 = dom.createTextNode("Hours");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("                    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element7 = dom.childAt(fragment, [1, 3]);
          var morphs = new Array(7);
          morphs[0] = dom.createMorphAt(element7,1,1);
          morphs[1] = dom.createMorphAt(element7,2,2);
          morphs[2] = dom.createMorphAt(element7,3,3);
          morphs[3] = dom.createMorphAt(element7,4,4);
          morphs[4] = dom.createMorphAt(element7,5,5);
          morphs[5] = dom.createMorphAt(element7,6,6);
          morphs[6] = dom.createMorphAt(element7,7,7);
          return morphs;
        },
        statements: [
          ["block","if",[["get","restaurant.openHours.mon",["loc",[null,[36,28],[36,52]]]]],[],0,null,["loc",[null,[36,22],[38,29]]]],
          ["block","if",[["get","restaurant.openHours.tue",["loc",[null,[39,28],[39,52]]]]],[],1,null,["loc",[null,[39,22],[41,29]]]],
          ["block","if",[["get","restaurant.openHours.wed",["loc",[null,[42,28],[42,52]]]]],[],2,null,["loc",[null,[42,22],[44,29]]]],
          ["block","if",[["get","restaurant.openHours.thu",["loc",[null,[45,28],[45,52]]]]],[],3,null,["loc",[null,[45,22],[47,29]]]],
          ["block","if",[["get","restaurant.openHours.fri",["loc",[null,[48,28],[48,52]]]]],[],4,null,["loc",[null,[48,22],[50,29]]]],
          ["block","if",[["get","restaurant.openHours.sat",["loc",[null,[51,28],[51,52]]]]],[],5,null,["loc",[null,[51,22],[53,29]]]],
          ["block","if",[["get","restaurant.openHours.sun",["loc",[null,[54,28],[54,52]]]]],[],6,null,["loc",[null,[54,22],[56,29]]]]
        ],
        locals: [],
        templates: [child0, child1, child2, child3, child4, child5, child6]
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 66,
              "column": 16
            },
            "end": {
              "line": 71,
              "column": 16
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"target","_blank");
          var el2 = dom.createTextNode("\n                    OpenTable\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","glyphicon glyphicon-new-window");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element6 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createAttrMorph(element6, 'href');
          return morphs;
        },
        statements: [
          ["attribute","href",["concat",[["get","restaurant.opentableLink",["loc",[null,[67,29],[67,53]]]]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 71,
              "column": 16
            },
            "end": {
              "line": 73,
              "column": 16
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                 No\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 76,
              "column": 14
            },
            "end": {
              "line": 80,
              "column": 14
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"target","_blank");
          dom.setAttribute(el1,"class","menu-link");
          var el2 = dom.createTextNode("\n                  Menu\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element5 = dom.childAt(fragment, [1]);
          var morphs = new Array(1);
          morphs[0] = dom.createAttrMorph(element5, 'href');
          return morphs;
        },
        statements: [
          ["attribute","href",["concat",[["get","restaurant.menuURL",["loc",[null,[77,27],[77,45]]]]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child5 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 141,
              "column": 14
            },
            "end": {
              "line": 147,
              "column": 14
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","review-item");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("p class=\"quote\">&ldquo;{{quote.quote}}&rdquo;</p");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2,"class","quote");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element3 = dom.childAt(fragment, [1]);
          var element4 = dom.childAt(element3, [5]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element3, [3]),0,0);
          morphs[1] = dom.createAttrMorph(element4, 'href');
          morphs[2] = dom.createMorphAt(element4,0,0);
          return morphs;
        },
        statements: [
          ["content","quote.quote",["loc",[null,[144,35],[144,50]]]],
          ["attribute","href",["concat",[["get","quote.source",["loc",[null,[145,29],[145,41]]]]]]],
          ["content","quote.from",["loc",[null,[145,45],[145,59]]]]
        ],
        locals: ["quote"],
        templates: []
      };
    }());
    var child6 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 158,
                "column": 20
              },
              "end": {
                "line": 160,
                "column": 20
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            return morphs;
          },
          statements: [
            ["content","tag",["loc",[null,[159,26],[159,33]]]]
          ],
          locals: ["tag"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 151,
              "column": 14
            },
            "end": {
              "line": 163,
              "column": 14
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","best-known");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          dom.setAttribute(el2,"class","restaurant-header");
          var el3 = dom.createTextNode("\n                    Best For\n                  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("                  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 3]),1,1);
          return morphs;
        },
        statements: [
          ["block","each",[["get","tags",["loc",[null,[158,28],[158,32]]]]],[],0,null,["loc",[null,[158,20],[160,29]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child7 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 172,
                "column": 20
              },
              "end": {
                "line": 174,
                "column": 20
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            return morphs;
          },
          statements: [
            ["content","dish",["loc",[null,[173,26],[173,34]]]]
          ],
          locals: ["dish"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 165,
              "column": 14
            },
            "end": {
              "line": 177,
              "column": 14
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","notable-dishes");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          dom.setAttribute(el2,"class","restaurant-header");
          var el3 = dom.createTextNode("\n                    Notable Dishes\n                  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("                  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 3]),1,1);
          return morphs;
        },
        statements: [
          ["block","each",[["get","dishes",["loc",[null,[172,28],[172,34]]]]],[],0,null,["loc",[null,[172,20],[174,29]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child8 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 223,
                "column": 16
              },
              "end": {
                "line": 225,
                "column": 16
              }
            },
            "moduleName": "dine/templates/city/restaurant.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("img");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element0, 'src');
            morphs[1] = dom.createAttrMorph(element0, 'alt');
            return morphs;
          },
          statements: [
            ["attribute","src",["concat",[["get","image.url",["loc",[null,[224,30],[224,39]]]]]]],
            ["attribute","alt",["concat",[["get","image.source",["loc",[null,[224,50],[224,62]]]]]]]
          ],
          locals: ["image"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 195,
              "column": 10
            },
            "end": {
              "line": 236,
              "column": 10
            }
          },
          "moduleName": "dine/templates/city/restaurant.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","instagram small cf");
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","container");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","instagram-border");
          var el4 = dom.createTextNode("\n                  ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","instagram-header");
          var el5 = dom.createTextNode("\n                    ");
          dom.appendChild(el4, el5);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el5 = dom.createElement("svg");
          dom.setAttribute(el5,"version","1.1");
          dom.setAttribute(el5,"id","Isolation_Mode");
          dom.setAttribute(el5,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el5,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el5,"x","0px");
          dom.setAttribute(el5,"y","0px");
          dom.setAttribute(el5,"viewBox","0 0 48.3 43.7");
          dom.setAttribute(el5,"style","enable-background:new 0 0 48.3 43.7;");
          dom.setAttributeNS(el5,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el6 = dom.createTextNode("\n                      ");
          dom.appendChild(el5, el6);
          var el6 = dom.createElement("polygon");
          dom.setAttribute(el6,"points","41.8,2.5 6.5,2.5 6.5,11.6 15.7,11.6 15.7,41.1 19.2,41.1 19.2,11.6 22.4,11.6 22.4,41.1 25.9,41.1 25.9,11.6\n                      29.1,11.6 29.1,41.1 32.6,41.1 32.6,11.6 41.8,11.6 ");
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n                    ");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                    ");
          dom.appendChild(el4, el5);
          dom.setNamespace(null);
          var el5 = dom.createElement("span");
          var el6 = dom.createTextNode("ON");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                    ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("div");
          dom.setAttribute(el5,"class","instagram-icon");
          var el6 = dom.createTextNode("\n                      ");
          dom.appendChild(el5, el6);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el6 = dom.createElement("svg");
          dom.setAttribute(el6,"version","1.1");
          dom.setAttribute(el6,"id","Layer_1");
          dom.setAttribute(el6,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el6,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el6,"x","0px");
          dom.setAttribute(el6,"y","0px");
          dom.setAttribute(el6,"viewBox","0 0 25.5 24.2");
          dom.setAttribute(el6,"style","enable-background:new 0 0 25.5 24.2;");
          dom.setAttributeNS(el6,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el7 = dom.createTextNode("\n                        ");
          dom.appendChild(el6, el7);
          var el7 = dom.createElement("g");
          var el8 = dom.createTextNode("\n                          ");
          dom.appendChild(el7, el8);
          var el8 = dom.createElement("path");
          dom.setAttribute(el8,"d","M20.4,2.1c1.3,0,2.4,1.1,2.4,2.4v14c0,1.4-1.1,2.4-2.4,2.4h-14c-1.4,0-2.4-1.1-2.4-2.4v-14c0-1.3,1.1-2.4,2.4-2.4H20.4z\n                          M20.7,10.1H19c0.2,0.5,0.3,1,0.3,1.6c0,3.2-2.6,5.7-5.9,5.7c-3.2,0-5.9-2.5-5.9-5.7c0-0.6,0.1-1.1,0.3-1.6H6v8\n                          c0,0.4,0.4,0.8,0.8,0.8H20c0.4,0,0.8-0.3,0.8-0.8V10.1z M9.6,11.5c0,2,1.7,3.6,3.8,3.6c2.1,0,3.8-1.7,3.8-3.6\n                          c0-2.1-1.7-3.7-3.8-3.7C11.3,7.8,9.6,9.5,9.6,11.5z M17.7,4.2c-0.4,0-0.8,0.4-0.8,0.9v2.1c0,0.4,0.4,0.8,0.8,0.8h2.2\n                          c0.5,0,0.9-0.4,0.9-0.8V5c0-0.4-0.4-0.9-0.9-0.9H17.7z");
          dom.appendChild(el7, el8);
          var el8 = dom.createTextNode("\n                        ");
          dom.appendChild(el7, el8);
          dom.appendChild(el6, el7);
          var el7 = dom.createTextNode("\n                      ");
          dom.appendChild(el6, el7);
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n                    ");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                  ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n              ");
          dom.appendChild(el1, el2);
          dom.setNamespace(null);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","instagram-box cf");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n              ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","follow-us");
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","container");
          var el4 = dom.createTextNode("\n                  ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("a");
          dom.setAttribute(el4,"target","_blank");
          dom.setAttribute(el4,"class","btn white");
          var el5 = dom.createTextNode("\n                    @");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n                  ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [5, 1, 1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
          morphs[1] = dom.createAttrMorph(element2, 'href');
          morphs[2] = dom.createMorphAt(element2,1,1);
          return morphs;
        },
        statements: [
          ["block","each",[["get","restaurant.imagesArray",["loc",[null,[223,24],[223,46]]]]],[],0,null,["loc",[null,[223,16],[225,25]]]],
          ["attribute","href",["concat",["https://instagram.com/",["get","instagramHandle",["loc",[null,[230,51],[230,66]]]]]]],
          ["content","instagramHandle",["loc",[null,[231,21],[231,40]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 252,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/restaurant.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"class","article-section-header restaurant absolute-share");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","heading-wrapper");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","heading article ");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","article-header-wrapper");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","restaurant-box");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","restaurant-box-top js-restaurant-top-info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h4");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("span");
        dom.setAttribute(el9,"class","category-sub-header");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createComment("");
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h2");
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","row");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9,"class","address");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("p");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("br");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("br");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n");
        dom.appendChild(el10, el11);
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n\n");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","restaurant-box-bottom js-restaurant-bottom-info");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h3");
        var el9 = dom.createTextNode("\n                Reservations:\n");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","article-share");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","shares");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","heart");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","count");
        var el7 = dom.createTextNode("346");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","icon icon-heart");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","facebook");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","icon icon-facebook-share");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","twitter");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","icon icon-twitter-share");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","pinterest");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","icon icon-pinterest-share");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","mail");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","icon icon-envelope-share");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","stumble");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","icon icon-stumble-share");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5,"class","google-plus");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("i");
        dom.setAttribute(el6,"class","icon icon-google-share");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","restaurant-map map js-load-map");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("article");
        dom.setAttribute(el1,"class","article-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","article-header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","container-shift");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","article-left");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","article-meta");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","left");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8,"class","article-action-buttons");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","#");
        dom.setAttribute(el9,"class","article-action-buttons-button button-print");
        var el10 = dom.createTextNode("Print");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","#");
        dom.setAttribute(el9,"class","article-action-buttons-button button-save");
        var el10 = dom.createTextNode("Save");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","article-copy");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","review-section");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h3");
        dom.setAttribute(el8,"class","restaurant-header");
        var el9 = dom.createTextNode("Reviews");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","additional-information");
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","article-right");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment(" BEGIN: Willian: Don't worry about this div. We will use a real DFP-served advertisement once you finish the rest of the page ");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","ad");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","ad-dots");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("<img src=\"http://images01.tastingtable.com/images/articles/2015_12/Sweeps_SF_300x600.jpg\"> ");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment(" END: Willian: Don't worry about this div. We will use a real DFP-served advertisement once you finish the rest of the page ");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("          \n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","ad");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","ad-dots");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element9 = dom.childAt(fragment, [2]);
        var element10 = dom.childAt(element9, [1, 1, 1, 1, 1]);
        var element11 = dom.childAt(element10, [1]);
        var element12 = dom.childAt(element11, [1]);
        var element13 = dom.childAt(element11, [5]);
        var element14 = dom.childAt(element13, [1, 1]);
        var element15 = dom.childAt(element10, [3]);
        var element16 = dom.childAt(fragment, [4, 1, 1, 1]);
        var element17 = dom.childAt(element16, [1, 3]);
        var element18 = dom.childAt(element17, [3]);
        var element19 = dom.childAt(element16, [3]);
        var morphs = new Array(19);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(element12,1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element12, [3]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element11, [3]),0,0);
        morphs[4] = dom.createMorphAt(element14,1,1);
        morphs[5] = dom.createMorphAt(element14,4,4);
        morphs[6] = dom.createMorphAt(element14,6,6);
        morphs[7] = dom.createMorphAt(element14,9,9);
        morphs[8] = dom.createMorphAt(element14,11,11);
        morphs[9] = dom.createMorphAt(element13,3,3);
        morphs[10] = dom.createMorphAt(dom.childAt(element15, [1]),1,1);
        morphs[11] = dom.createMorphAt(element15,3,3);
        morphs[12] = dom.createMorphAt(dom.childAt(element9, [6]),1,1);
        morphs[13] = dom.createMorphAt(dom.childAt(element17, [1]),3,3);
        morphs[14] = dom.createMorphAt(element18,1,1);
        morphs[15] = dom.createMorphAt(element18,3,3);
        morphs[16] = dom.createMorphAt(dom.childAt(element19, [3, 1]),1,1);
        morphs[17] = dom.createMorphAt(element19,7,7);
        morphs[18] = dom.createMorphAt(dom.childAt(element19, [9, 1]),1,1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","smart-app-banner",[],["bannerData",["subexpr","@mut",[["get","bannerData",["loc",[null,[1,30],[1,40]]]]],[],[]]],["loc",[null,[1,0],[1,42]]]],
        ["content","restaurant.cuisine",["loc",[null,[10,16],[10,38]]]],
        ["content","restaurant.priceRange",["loc",[null,[12,18],[12,43]]]],
        ["content","restaurant.title",["loc",[null,[16,18],[16,38]]]],
        ["content","restaurant.address",["loc",[null,[21,20],[21,42]]]],
        ["content","restaurant.district",["loc",[null,[22,20],[22,43]]]],
        ["content","restaurant.zip",["loc",[null,[23,20],[23,38]]]],
        ["content","restaurant.phone",["loc",[null,[24,20],[24,40]]]],
        ["block","if",[["get","restaurant.website",["loc",[null,[25,26],[25,44]]]]],[],0,null,["loc",[null,[25,20],[27,27]]]],
        ["block","if",[["get","hasOpenHours",["loc",[null,[31,22],[31,34]]]]],[],1,null,["loc",[null,[31,16],[59,23]]]],
        ["block","if",[["get","restaurant.opentableLink",["loc",[null,[66,22],[66,46]]]]],[],2,3,["loc",[null,[66,16],[73,23]]]],
        ["block","if",[["get","restaurant.menuURL",["loc",[null,[76,20],[76,38]]]]],[],4,null,["loc",[null,[76,14],[80,21]]]],
        ["inline","restaurant-map",[],["entries",["subexpr","@mut",[["get","mapEntries",["loc",[null,[118,33],[118,43]]]]],[],[]],"offset",true],["loc",[null,[118,8],[118,57]]]],
        ["block","each",[["get","restaurant.quotes",["loc",[null,[141,22],[141,39]]]]],[],5,null,["loc",[null,[141,14],[147,23]]]],
        ["block","if",[["get","tags.length",["loc",[null,[151,20],[151,31]]]]],[],6,null,["loc",[null,[151,14],[163,21]]]],
        ["block","if",[["get","dishes.length",["loc",[null,[165,20],[165,33]]]]],[],7,null,["loc",[null,[165,14],[177,21]]]],
        ["inline","dfp-ad",[],["divID","div-gpt-ad-1448375439589-2","targeting",["subexpr","@mut",[["get","targeting",["loc",[null,[188,26],[188,35]]]]],[],[]]],["loc",[null,[186,14],[189,18]]]],
        ["block","if",[["get","restaurant.imagesArray.length",["loc",[null,[195,16],[195,45]]]]],[],8,null,["loc",[null,[195,10],[236,17]]]],
        ["inline","dfp-ad",[],["divID","div-gpt-ad-1448375439589-3","targeting",["subexpr","@mut",[["get","targeting",["loc",[null,[242,26],[242,35]]]]],[],[]]],["loc",[null,[240,14],[243,18]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6, child7, child8]
    };
  }()));

});
define('dine/templates/city/restaurants', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 0
            }
          },
          "moduleName": "dine/templates/city/restaurants.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          return morphs;
        },
        statements: [
          ["inline","restaurants-map",[],["restaurants",["subexpr","@mut",[["get","restaurantsForMap",["loc",[null,[3,30],[3,47]]]]],[],[]],"searchQuery",["subexpr","@mut",[["get","searchQuery",["loc",[null,[3,60],[3,71]]]]],[],[]]],["loc",[null,[3,0],[3,73]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 30,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city/restaurants.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" <section class=\"map-data without-map\">\n      <div class=\"map-header\">\n            <div class=\"container\">\n            </div>\n      </div>\n</section> ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,6,6,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","smart-app-banner",["loc",[null,[1,0],[1,20]]]],
        ["block","is-mobile",[],["show",false],0,null,["loc",[null,[2,0],[4,14]]]],
        ["inline","restaurants-list",[],["city",["subexpr","@mut",[["get","city",["loc",[null,[15,24],[15,28]]]]],[],[]],"cityName",["subexpr","@mut",[["get","cityName",["loc",[null,[16,28],[16,36]]]]],[],[]],"citySlug",["subexpr","@mut",[["get","citySlug",["loc",[null,[17,28],[17,36]]]]],[],[]],"cities",["subexpr","@mut",[["get","cities",["loc",[null,[18,26],[18,32]]]]],[],[]],"restaurants",["subexpr","@mut",[["get","restaurants",["loc",[null,[19,31],[19,42]]]]],[],[]],"neighborhoodLabel",["subexpr","@mut",[["get","neighborhoodLabel",["loc",[null,[20,37],[20,54]]]]],[],[]],"neighborhoodSlug",["subexpr","@mut",[["get","neighborhoodSlug",["loc",[null,[21,36],[21,52]]]]],[],[]],"neighborhoods",["subexpr","@mut",[["get","neighborhoods",["loc",[null,[22,33],[22,46]]]]],[],[]],"cuisineLabel",["subexpr","@mut",[["get","cuisineLabel",["loc",[null,[23,32],[23,44]]]]],[],[]],"cuisineSlug",["subexpr","@mut",[["get","cuisineSlug",["loc",[null,[24,31],[24,42]]]]],[],[]],"cuisines",["subexpr","@mut",[["get","cuisines",["loc",[null,[25,28],[25,36]]]]],[],[]],"featureLabel",["subexpr","@mut",[["get","featureLabel",["loc",[null,[26,32],[26,44]]]]],[],[]],"featureSlug",["subexpr","@mut",[["get","featureSlug",["loc",[null,[27,31],[27,42]]]]],[],[]],"features",["subexpr","@mut",[["get","features",["loc",[null,[28,28],[28,36]]]]],[],[]],"searchQuery",["subexpr","@mut",[["get","searchQuery",["loc",[null,[29,31],[29,42]]]]],[],[]]],["loc",[null,[15,0],[29,44]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('dine/templates/city', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/city.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,0],[1,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/collection-card', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 20,
              "column": 2
            }
          },
          "moduleName": "dine/templates/components/collection-card.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-image");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","card-image-inner");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","image-asset");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-text card-full-text");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          dom.setAttribute(el2,"class","card-text-title card-text-title-alt");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2,"class","card-text-sub-copy small");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","social");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"href","#");
          dom.setAttribute(el3,"class","social-link social-link-facebook");
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"class","icon-facebook-share");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"href","#");
          dom.setAttribute(el3,"class","social-link social-link-twitter");
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"class","icon-twitter-share");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"href","#");
          dom.setAttribute(el3,"class","social-link social-link-pinterest");
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"class","icon-pinterest-share");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","social-hearts");
          var el3 = dom.createTextNode("\n        1,024 ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","icon-heart");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element0, [3]);
          var element3 = dom.childAt(fragment, [3]);
          var morphs = new Array(4);
          morphs[0] = dom.createAttrMorph(element1, 'style');
          morphs[1] = dom.createAttrMorph(element2, 'src');
          morphs[2] = dom.createMorphAt(dom.childAt(element3, [1]),0,0);
          morphs[3] = dom.createMorphAt(dom.childAt(element3, [3]),0,0);
          return morphs;
        },
        statements: [
          ["attribute","style",["concat",["background-image: url('",["get","collection.image",["loc",[null,[4,68],[4,84]]]],"');"]]],
          ["attribute","src",["concat",[["get","constants.staticS3Url",["loc",[null,[5,18],[5,39]]]],"/dist/assets/images/card-spacer.png"]]],
          ["content","collection.title",["loc",[null,[8,54],[8,74]]]],
          ["content","collection.bannerText",["loc",[null,[9,42],[9,67]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/collection-card.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["city.collections.restaurants",["get","collection.city.slug",["loc",[null,[2,44],[2,64]]]],["get","collection.slug",["loc",[null,[2,65],[2,80]]]]],["class","card-link"],0,null,["loc",[null,[2,2],[20,14]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('dine/templates/components/collection-restaurants-list', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 11,
                "column": 12
              },
              "end": {
                "line": 15,
                "column": 12
              }
            },
            "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"class","menu-link");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element2);
            morphs[1] = dom.createMorphAt(element2,1,1);
            return morphs;
          },
          statements: [
            ["element","bind-attr",[],["href","view.href"],["loc",[null,[12,17],[12,47]]]],
            ["content","city.title",["loc",[null,[13,16],[13,30]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 10
            },
            "end": {
              "line": 16,
              "column": 10
            }
          },
          "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","link-to",["city.collections",["get","city.slug",["loc",[null,[11,42],[11,51]]]]],["class","menu-item","tagName","li","href",false],0,null,["loc",[null,[11,12],[15,24]]]]
        ],
        locals: ["city"],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 21,
              "column": 6
            },
            "end": {
              "line": 23,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","active");
          var el2 = dom.createTextNode("Lists");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 6
            },
            "end": {
              "line": 27,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Restaurants");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 88,
                "column": 16
              },
              "end": {
                "line": 90,
                "column": 16
              }
            },
            "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["inline","restaurant-card",[],["restaurant",["subexpr","@mut",[["get","restaurant",["loc",[null,[89,47],[89,57]]]]],[],[]]],["loc",[null,[89,18],[89,59]]]]
          ],
          locals: ["restaurant"],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 94,
                "column": 12
              },
              "end": {
                "line": 100,
                "column": 12
              }
            },
            "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","cta-wrapper");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"class","btn pink");
            var el3 = dom.createTextNode("\n                  Load More\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1, 1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [
            ["element","action",["loadMore"],["on","click"],["loc",[null,[96,41],[96,73]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 82,
              "column": 6
            },
            "end": {
              "line": 103,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-results js-results");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment(" Restaurants: Two Up Cards ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","cards cards-two-up cards-map-app cards-mobile-micro cards-sans-serif");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","inner");
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","card-container filter-card-holder");
          var el5 = dom.createTextNode("\n");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("              ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 3]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 1]),1,1);
          morphs[1] = dom.createMorphAt(element1,3,3);
          return morphs;
        },
        statements: [
          ["block","each",[["get","paginatedResults",["loc",[null,[88,24],[88,40]]]]],[],0,null,["loc",[null,[88,16],[90,25]]]],
          ["block","if",[["get","showLoadMore",["loc",[null,[94,18],[94,30]]]]],[],1,null,["loc",[null,[94,12],[100,19]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 107,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/collection-restaurants-list.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","map-app-filtering");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","top-filters cf");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","city-filters");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","menu");
        dom.setAttribute(el4,"tabindex","1");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","current-item");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","icon icon-arrow-down");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","menu-items");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","filter-toggle-tabs");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" For the filters when one is selected an event is fired\n  $('body').trigger('dropdown-change', val); if you want want to customize the filters listen using $('body').on('dropdown-change', function(event, value) {});\n\n  Some filtering already exists, take out these if you don't want to use it:  data-behaviour=\"filter-card\" and  filter-card-holder\n  data-sharecount=\"100\" data-date=\"September 10, 2015\" data-type=\"~breakfast~brunch~\" on the cards enable them for filtering.\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cards-listings cf");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cards-listings-wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","card-search-terms");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" div class=\"card-sorting\">\n        <div class=\"return js-return hidden\">\n          <a href=\"\" class=\"back\">Back</a>\n        </div>\n        <div class=\"sort-by js-sort\">\n          <span class=\"\">Sort by: </span>\n          <div class=\"dropdown js-dropdown\" data-behaviour=\"filter-card\">\n            <div class=\"dropdown-active\">\n              <span class=\"active-item\">Latest\n              </span>\n              <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 36 36\" style=\"enable-background:new 0 0 36 36;\" xml:space=\"preserve\">\n                <polygon id=\"XMLID_2_\" points=\"5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 \"></polygon>\n              </svg>\n            </div>\n            <ul>\n              <li data-value=\"recent\">latest</li>\n              <li data-value=\"popularity\">Popularity</li>\n              <li data-value=\"price\">Price</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"filter-layout js-layout-switch\">\n          <div class=\"toggle-controls\">\n            <ul>\n              <li class=\"js-layout \" data-filter-layout=\"rows\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid\" width=\"20\" height=\"14\" viewBox=\"0 0 20 14\">\n                  <path d=\"M6.188,14.000 L6.188,10.281 L20.000,10.281 L20.000,14.000 L6.188,14.000 ZM6.188,5.188 L20.000,5.188 L20.000,8.812 L6.188,8.812 L6.188,5.188 ZM6.188,0.000 L20.000,0.000 L20.000,3.719 L6.188,3.719 L6.188,0.000 ZM-0.000,10.281 L4.594,10.281 L4.594,14.000 L-0.000,14.000 L-0.000,10.281 ZM-0.000,5.188 L4.594,5.188 L4.594,8.812 L-0.000,8.812 L-0.000,5.188 ZM-0.000,0.000 L4.594,0.000 L4.594,3.719 L-0.000,3.719 L-0.000,0.000 Z\" class=\"cls-1\"/>\n                </svg>\n              </li>\n              <li class=\"js-layout active\" data-filter-layout=\"grid\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid\" width=\"15\" height=\"13\" viewBox=\"0 0 15 13\">\n                  <path d=\"M8.406,13.000 L8.406,7.437 L15.000,7.437 L15.000,13.000 L8.406,13.000 ZM8.406,-0.000 L15.000,-0.000 L15.000,5.563 L8.406,5.563 L8.406,-0.000 ZM-0.000,7.437 L6.594,7.437 L6.594,13.000 L-0.000,13.000 L-0.000,7.437 ZM-0.000,-0.000 L6.594,-0.000 L6.594,5.563 L-0.000,5.563 L-0.000,-0.000 Z\" class=\"cls-1\"/>\n                </svg>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [0]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element4, [1, 1]);
        var element6 = dom.childAt(element4, [3]);
        var element7 = dom.childAt(element3, [5, 1]);
        var element8 = dom.childAt(element7, [1]);
        var morphs = new Array(7);
        morphs[0] = dom.createMorphAt(dom.childAt(element5, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
        morphs[2] = dom.createMorphAt(element6,1,1);
        morphs[3] = dom.createMorphAt(element6,3,3);
        morphs[4] = dom.createMorphAt(dom.childAt(element8, [1]),0,0);
        morphs[5] = dom.createMorphAt(dom.childAt(element8, [3]),0,0);
        morphs[6] = dom.createMorphAt(element7,5,5);
        return morphs;
      },
      statements: [
        ["content","cityName",["loc",[null,[6,10],[6,22]]]],
        ["block","each",[["get","cities",["loc",[null,[10,18],[10,24]]]]],[],0,null,["loc",[null,[10,10],[16,19]]]],
        ["block","link-to",["city.collections",["get","citySlug",["loc",[null,[21,36],[21,44]]]]],[],1,null,["loc",[null,[21,6],[23,18]]]],
        ["block","link-to",["city.restaurantsWithFeatures",["get","citySlug",["loc",[null,[25,48],[25,56]]]],"all","all","all"],[],2,null,["loc",[null,[25,6],[27,18]]]],
        ["content","collection.title",["loc",[null,[39,12],[39,32]]]],
        ["content","resultMessage",["loc",[null,[40,12],[40,29]]]],
        ["block","if",[["get","restaurants.length",["loc",[null,[82,12],[82,30]]]]],[],3,null,["loc",[null,[82,6],[103,13]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('dine/templates/components/collections-list', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 11,
                "column": 12
              },
              "end": {
                "line": 15,
                "column": 12
              }
            },
            "moduleName": "dine/templates/components/collections-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"class","menu-link");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element2);
            morphs[1] = dom.createMorphAt(element2,1,1);
            return morphs;
          },
          statements: [
            ["element","bind-attr",[],["href","view.href"],["loc",[null,[12,17],[12,47]]]],
            ["content","city.title",["loc",[null,[13,16],[13,30]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 10
            },
            "end": {
              "line": 16,
              "column": 10
            }
          },
          "moduleName": "dine/templates/components/collections-list.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","link-to",["city.collections",["get","city.slug",["loc",[null,[11,42],[11,51]]]]],["tagName","li","href",false],0,null,["loc",[null,[11,12],[15,24]]]]
        ],
        locals: ["city"],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 21,
              "column": 6
            },
            "end": {
              "line": 23,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/collections-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","active");
          var el2 = dom.createTextNode("Lists");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 6
            },
            "end": {
              "line": 27,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/collections-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Restaurants");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 86,
                "column": 16
              },
              "end": {
                "line": 88,
                "column": 16
              }
            },
            "moduleName": "dine/templates/components/collections-list.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["inline","collection-card",[],["collection",["subexpr","@mut",[["get","collection",["loc",[null,[87,47],[87,57]]]]],[],[]]],["loc",[null,[87,18],[87,59]]]]
          ],
          locals: ["collection"],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 92,
                "column": 12
              },
              "end": {
                "line": 98,
                "column": 12
              }
            },
            "moduleName": "dine/templates/components/collections-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","cta-wrapper");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"class","btn pink");
            var el3 = dom.createTextNode("\n                  Load More\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1, 1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [
            ["element","action",["loadMore"],["on","click"],["loc",[null,[94,41],[94,73]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 81,
              "column": 6
            },
            "end": {
              "line": 101,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/collections-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-results js-results");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","cards cards-two-up cards-map-app cards-mobile-micro cards-sans-serif");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","inner");
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","card-container");
          var el5 = dom.createTextNode("\n");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("              ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 1]),1,1);
          morphs[1] = dom.createMorphAt(element1,3,3);
          return morphs;
        },
        statements: [
          ["block","each",[["get","paginatedResults",["loc",[null,[86,24],[86,40]]]]],[],0,null,["loc",[null,[86,16],[88,25]]]],
          ["block","if",[["get","showLoadMore",["loc",[null,[92,18],[92,30]]]]],[],1,null,["loc",[null,[92,12],[98,19]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 105,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/collections-list.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","map-app-filtering");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","top-filters cf");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","city-filters");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","menu");
        dom.setAttribute(el4,"tabindex","1");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","current-item");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","icon icon-arrow-down");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","menu-items");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","filter-toggle-tabs");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cards-listings cf");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cards-listings-wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","card-search-terms");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" div class=\"card-sorting\">\n        <div class=\"return js-return hidden\">\n          <a href=\"\" class=\"back\">Back</a>\n        </div>\n        <div class=\"sort-by js-sort\">\n          <span class=\"\">Sort by: </span>\n          <div class=\"dropdown js-dropdown\" data-behaviour=\"filter-card\">\n            <div class=\"dropdown-active\">\n              <span class=\"active-item\">Latest\n              </span>\n              <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 36 36\" style=\"enable-background:new 0 0 36 36;\" xml:space=\"preserve\">\n                <polygon id=\"XMLID_2_\" points=\"5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 \"></polygon>\n              </svg>\n            </div>\n            <ul>\n              <li data-value=\"recent\">latest</li>\n              <li data-value=\"popularity\">Popularity</li>\n              <li data-value=\"price\">Price</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"filter-layout js-layout-switch\">\n          <div class=\"toggle-controls\">\n            <ul>\n              <li class=\"js-layout \" data-filter-layout=\"rows\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid\" width=\"20\" height=\"14\" viewBox=\"0 0 20 14\">\n                  <path d=\"M6.188,14.000 L6.188,10.281 L20.000,10.281 L20.000,14.000 L6.188,14.000 ZM6.188,5.188 L20.000,5.188 L20.000,8.812 L6.188,8.812 L6.188,5.188 ZM6.188,0.000 L20.000,0.000 L20.000,3.719 L6.188,3.719 L6.188,0.000 ZM-0.000,10.281 L4.594,10.281 L4.594,14.000 L-0.000,14.000 L-0.000,10.281 ZM-0.000,5.188 L4.594,5.188 L4.594,8.812 L-0.000,8.812 L-0.000,5.188 ZM-0.000,0.000 L4.594,0.000 L4.594,3.719 L-0.000,3.719 L-0.000,0.000 Z\" class=\"cls-1\"/>\n                </svg>\n              </li>\n              <li class=\"js-layout active\" data-filter-layout=\"grid\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid\" width=\"15\" height=\"13\" viewBox=\"0 0 15 13\">\n                  <path d=\"M8.406,13.000 L8.406,7.437 L15.000,7.437 L15.000,13.000 L8.406,13.000 ZM8.406,-0.000 L15.000,-0.000 L15.000,5.563 L8.406,5.563 L8.406,-0.000 ZM-0.000,7.437 L6.594,7.437 L6.594,13.000 L-0.000,13.000 L-0.000,7.437 ZM-0.000,-0.000 L6.594,-0.000 L6.594,5.563 L-0.000,5.563 L-0.000,-0.000 Z\" class=\"cls-1\"/>\n                </svg>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","collection-header hidden js-collection-show");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("GQ Top Picks");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Lorem ipsum dolor sit amet, laoreet sed interdum a at. Magna odio nam, eros in, amet id ligula tristiques.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [0]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element4, [1, 1]);
        var element6 = dom.childAt(element4, [3]);
        var element7 = dom.childAt(element3, [3, 1]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element5, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
        morphs[2] = dom.createMorphAt(element6,1,1);
        morphs[3] = dom.createMorphAt(element6,3,3);
        morphs[4] = dom.createMorphAt(dom.childAt(element7, [1, 1]),0,0);
        morphs[5] = dom.createMorphAt(element7,7,7);
        return morphs;
      },
      statements: [
        ["content","cityName",["loc",[null,[6,10],[6,22]]]],
        ["block","each",[["get","cities",["loc",[null,[10,18],[10,24]]]]],[],0,null,["loc",[null,[10,10],[16,19]]]],
        ["block","link-to",["city.collections",["get","citySlug",["loc",[null,[21,36],[21,44]]]]],[],1,null,["loc",[null,[21,6],[23,18]]]],
        ["block","link-to",["city.restaurantsWithFeatures",["get","citySlug",["loc",[null,[25,48],[25,56]]]],"all","all","all"],[],2,null,["loc",[null,[25,6],[27,18]]]],
        ["content","resultMessage",["loc",[null,[34,12],[34,29]]]],
        ["block","if",[["get","collections.length",["loc",[null,[81,12],[81,30]]]]],[],3,null,["loc",[null,[81,6],[101,13]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('dine/templates/components/dfp-ad', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 72
          }
        },
        "moduleName": "dine/templates/components/dfp-ad.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'id');
        morphs[1] = dom.createAttrMorph(element0, 'style');
        return morphs;
      },
      statements: [
        ["attribute","id",["get","divID",["loc",[null,[1,10],[1,15]]]]],
        ["attribute","style",["concat",["height:",["get","height",["loc",[null,[1,34],[1,40]]]],"px; width:",["get","width",["loc",[null,[1,54],[1,59]]]],"px;"]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/is-mobile', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 2,
                "column": 1
              },
              "end": {
                "line": 4,
                "column": 1
              }
            },
            "moduleName": "dine/templates/components/is-mobile.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("		");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","yield",["loc",[null,[3,2],[3,11]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "dine/templates/components/is-mobile.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","if",[["get","show",["loc",[null,[2,7],[2,11]]]]],[],0,null,["loc",[null,[2,1],[4,8]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 6,
                "column": 1
              },
              "end": {
                "line": 8,
                "column": 1
              }
            },
            "moduleName": "dine/templates/components/is-mobile.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("		");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","yield",["loc",[null,[7,2],[7,11]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 0
            },
            "end": {
              "line": 9,
              "column": 0
            }
          },
          "moduleName": "dine/templates/components/is-mobile.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","unless",[["get","show",["loc",[null,[6,11],[6,15]]]]],[],0,null,["loc",[null,[6,1],[8,12]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/is-mobile.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","isMobile",["loc",[null,[1,6],[1,14]]]]],[],0,1,["loc",[null,[1,0],[9,7]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('dine/templates/components/loading-indicator', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/loading-indicator.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","rect1");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","rect2");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","rect3");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","rect4");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","rect5");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(1);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        return morphs;
      },
      statements: [
        ["attribute","class",["concat",["spinner js-loading-indicator ",["get","class",["loc",[null,[1,43],[1,48]]]]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/modal-popup', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 7
            },
            "end": {
              "line": 11,
              "column": 7
            }
          },
          "moduleName": "dine/templates/components/modal-popup.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      		");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["content","yield",["loc",[null,[10,8],[10,17]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 7
            },
            "end": {
              "line": 13,
              "column": 7
            }
          },
          "moduleName": "dine/templates/components/modal-popup.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      		");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createUnsafeMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["content","content",["loc",[null,[12,8],[12,21]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/modal-popup.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","modal fade");
        dom.setAttribute(el1,"tabindex","-1");
        dom.setAttribute(el1,"role","dialog");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","modal-dialog");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","modal-content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","close");
        dom.setAttribute(el5,"data-dismiss","modal");
        dom.setAttribute(el5,"aria-label","Close");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"aria-hidden","true");
        var el7 = dom.createTextNode("×");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","modal-title");
        var el6 = dom.createTextNode("Modal title");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-body");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" /.modal-content ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /.modal-dialog ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" /.modal ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1, 1, 3]),1,1);
        return morphs;
      },
      statements: [
        ["block","if",[["get","hasBlock",["loc",[null,[9,13],[9,21]]]]],[],0,1,["loc",[null,[9,7],[13,14]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('dine/templates/components/restaurant-card', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 28,
              "column": 2
            }
          },
          "moduleName": "dine/templates/components/restaurant-card.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-image");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","card-image-inner");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","image-asset");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-text card-full-text");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h3");
          dom.setAttribute(el2,"class","card-text-title card-text-title-alt");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2,"class","card-text-sub-copy small");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(",\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(",\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("br");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","meta");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","category-type");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","category-price");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element0, [3]);
          var element3 = dom.childAt(fragment, [3]);
          var element4 = dom.childAt(element3, [3]);
          var element5 = dom.childAt(element3, [5]);
          var morphs = new Array(9);
          morphs[0] = dom.createAttrMorph(element1, 'style');
          morphs[1] = dom.createAttrMorph(element2, 'src');
          morphs[2] = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
          morphs[3] = dom.createMorphAt(element4,1,1);
          morphs[4] = dom.createMorphAt(element4,3,3);
          morphs[5] = dom.createMorphAt(element4,5,5);
          morphs[6] = dom.createMorphAt(element4,8,8);
          morphs[7] = dom.createMorphAt(dom.childAt(element5, [1]),1,1);
          morphs[8] = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
          return morphs;
        },
        statements: [
          ["attribute","style",["concat",["background-image: url('",["get","mainImage",["loc",[null,[4,68],[4,77]]]],"');"]]],
          ["attribute","src",["concat",[["get","constants.staticS3Url",["loc",[null,[5,18],[5,39]]]],"/dist/assets/images/card-spacer.png"]]],
          ["content","restaurant.title",["loc",[null,[10,8],[10,28]]]],
          ["content","restaurant.address",["loc",[null,[13,8],[13,30]]]],
          ["content","restaurant.district",["loc",[null,[14,8],[14,31]]]],
          ["content","restaurant.zip",["loc",[null,[15,8],[15,26]]]],
          ["content","restaurant.phone",["loc",[null,[16,8],[16,28]]]],
          ["content","cuisines",["loc",[null,[21,10],[21,22]]]],
          ["content","restaurant.priceRange",["loc",[null,[24,10],[24,35]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 30,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/restaurant-card.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"data-sharecount","100");
        dom.setAttribute(el1,"data-date","September 10, 2015");
        dom.setAttribute(el1,"data-type","~breakfast~brunch~");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["city.restaurant",["get","restaurant.city.slug",["loc",[null,[2,31],[2,51]]]],["get","restaurant.slug",["loc",[null,[2,52],[2,67]]]]],["class","card-link"],0,null,["loc",[null,[2,2],[28,14]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('dine/templates/components/restaurant-landing', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 16
            },
            "end": {
              "line": 13,
              "column": 16
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["content","cityName",["loc",[null,[12,18],[12,30]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 16
            },
            "end": {
              "line": 15,
              "column": 16
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  City\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 22,
              "column": 14
            },
            "end": {
              "line": 26,
              "column": 14
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element5 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element5);
          morphs[1] = dom.createMorphAt(element5,1,1);
          return morphs;
        },
        statements: [
          ["element","action",["getNeighborhoods",["get","city.slug",["loc",[null,[23,48],[23,57]]]]],["on","click"],["loc",[null,[23,20],[23,70]]]],
          ["content","city.title",["loc",[null,[24,18],[24,32]]]]
        ],
        locals: ["city"],
        templates: []
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 45,
                "column": 16
              },
              "end": {
                "line": 49,
                "column": 16
              }
            },
            "moduleName": "dine/templates/components/restaurant-landing.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("\n                    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                  ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element3);
            morphs[1] = dom.createMorphAt(element3,1,1);
            return morphs;
          },
          statements: [
            ["element","action",["getCuisines",["get","neighborhood.slug",["loc",[null,[46,45],[46,62]]]]],["on","click"],["loc",[null,[46,22],[46,75]]]],
            ["content","neighborhood.name",["loc",[null,[47,20],[47,41]]]]
          ],
          locals: ["neighborhood"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 41,
              "column": 14
            },
            "end": {
              "line": 50,
              "column": 14
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n                  All\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element4 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element4);
          morphs[1] = dom.createMorphAt(fragment,3,3,contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["element","action",["getCuisines","all"],["on","click"],["loc",[null,[42,20],[42,61]]]],
          ["block","each",[["get","neighborhoods",["loc",[null,[45,24],[45,37]]]]],[],0,null,["loc",[null,[45,16],[49,25]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 50,
              "column": 14
            },
            "end": {
              "line": 52,
              "column": 14
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("Select a city...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child5 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 70,
                "column": 16
              },
              "end": {
                "line": 74,
                "column": 16
              }
            },
            "moduleName": "dine/templates/components/restaurant-landing.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("\n                    ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                  ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element1);
            morphs[1] = dom.createMorphAt(element1,1,1);
            return morphs;
          },
          statements: [
            ["element","action",["selectCuisine",["get","cuisine.slug",["loc",[null,[71,47],[71,59]]]]],["on","click"],["loc",[null,[71,22],[71,72]]]],
            ["content","cuisine.name",["loc",[null,[72,20],[72,36]]]]
          ],
          locals: ["cuisine"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 66,
              "column": 14
            },
            "end": {
              "line": 75,
              "column": 14
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n                  All\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element2);
          morphs[1] = dom.createMorphAt(fragment,3,3,contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["element","action",["selectCuisine","all"],["on","click"],["loc",[null,[67,20],[67,63]]]],
          ["block","each",[["get","cuisines",["loc",[null,[70,24],[70,32]]]]],[],0,null,["loc",[null,[70,16],[74,25]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child6 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 75,
              "column": 14
            },
            "end": {
              "line": 77,
              "column": 14
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("Select a neighborhood...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child7 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 115,
              "column": 12
            },
            "end": {
              "line": 119,
              "column": 12
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","menu-item");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","menu-link");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
          return morphs;
        },
        statements: [
          ["element","action",["getNeighborhoods",["get","city.slug",["loc",[null,[116,46],[116,55]]]]],["on","click"],["loc",[null,[116,18],[116,68]]]],
          ["content","city.title",["loc",[null,[117,40],[117,54]]]]
        ],
        locals: ["city"],
        templates: []
      };
    }());
    var child8 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 137,
              "column": 4
            },
            "end": {
              "line": 139,
              "column": 4
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["content","loading-indicator",["loc",[null,[138,6],[138,27]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child9 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 145,
                "column": 8
              },
              "end": {
                "line": 147,
                "column": 8
              }
            },
            "moduleName": "dine/templates/components/restaurant-landing.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["inline","collection-card",[],["collection",["subexpr","@mut",[["get","collection",["loc",[null,[146,39],[146,49]]]]],[],[]]],["loc",[null,[146,10],[146,51]]]]
          ],
          locals: ["collection"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 139,
              "column": 4
            },
            "end": {
              "line": 149,
              "column": 4
            }
          },
          "moduleName": "dine/templates/components/restaurant-landing.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cards-header no-bot-pad cards-header-section-title-normal");
          var el2 = dom.createTextNode("\n        Recent lists in ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-container owl-carousel");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          return morphs;
        },
        statements: [
          ["content","cityName",["loc",[null,[141,24],[141,36]]]],
          ["block","each",[["get","collections",["loc",[null,[145,16],[145,27]]]]],[],0,null,["loc",[null,[145,8],[147,17]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 152,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/restaurant-landing.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","hero restaurant-landing");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","hero-background");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","vc");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        var el6 = dom.createTextNode("Effortlessly discover your city's best cuisine. No stars, no sifting, just great spots.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","search-restaurants");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("I'm in");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","dropdown js-dropdown");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","dropdown-active");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("span");
        dom.setAttribute(el8,"class","active-item");
        var el9 = dom.createTextNode("\n");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el8 = dom.createElement("svg");
        dom.setAttribute(el8,"version","1.0");
        dom.setAttribute(el8,"id","Layer_1");
        dom.setAttribute(el8,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el8,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el8,"x","0px");
        dom.setAttribute(el8,"y","0px");
        dom.setAttribute(el8,"viewBox","0 0 36 36");
        dom.setAttribute(el8,"style","enable-background:new 0 0 36 36;");
        dom.setAttributeNS(el8,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("polygon");
        dom.setAttribute(el9,"id","XMLID_2_");
        dom.setAttribute(el9,"points","5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 ");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.setNamespace(null);
        var el7 = dom.createElement("ul");
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("around");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","dropdown js-dropdown");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","dropdown-active");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("span");
        dom.setAttribute(el8,"class","active-item");
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el8 = dom.createElement("svg");
        dom.setAttribute(el8,"version","1.0");
        dom.setAttribute(el8,"id","Layer_1");
        dom.setAttribute(el8,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el8,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el8,"x","0px");
        dom.setAttribute(el8,"y","0px");
        dom.setAttribute(el8,"viewBox","0 0 36 36");
        dom.setAttribute(el8,"style","enable-background:new 0 0 36 36;");
        dom.setAttributeNS(el8,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("polygon");
        dom.setAttribute(el9,"id","XMLID_2_");
        dom.setAttribute(el9,"points","5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 ");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n\n            ");
        dom.appendChild(el6, el7);
        dom.setNamespace(null);
        var el7 = dom.createElement("ul");
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("i'm looking for:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","dropdown js-dropdown");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","dropdown-active");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("span");
        dom.setAttribute(el8,"class","active-item");
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el8 = dom.createElement("svg");
        dom.setAttribute(el8,"version","1.0");
        dom.setAttribute(el8,"id","Layer_1");
        dom.setAttribute(el8,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el8,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el8,"x","0px");
        dom.setAttribute(el8,"y","0px");
        dom.setAttribute(el8,"viewBox","0 0 36 36");
        dom.setAttribute(el8,"style","enable-background:new 0 0 36 36;");
        dom.setAttributeNS(el8,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("polygon");
        dom.setAttribute(el9,"id","XMLID_2_");
        dom.setAttribute(el9,"points","5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 ");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        dom.setNamespace(null);
        var el7 = dom.createElement("ul");
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("button");
        dom.setAttribute(el6,"class","btn pink");
        var el7 = dom.createTextNode("Search");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","section-map-app top-search");
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("section");
        dom.setAttribute(el5,"class","map-data");
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","map-header");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","container");
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n          ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n        ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n      ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","explore");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","https://bnc.lt/restaurantsDine");
        var el6 = dom.createElement("h4");
        var el7 = dom.createTextNode("Explore on-the-go with the DINE app ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("i");
        dom.setAttribute(el7,"class","icon icon-arrow-right");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","https://bnc.lt/restaurantsDine");
        dom.setAttribute(el5,"class","tablet");
        var el6 = dom.createElement("img");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","section-map-app bottom-search");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","top-filters");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","city-filters");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","menu");
        dom.setAttribute(el4,"tabindex","0");
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","current-item");
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n            ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","icon icon-arrow-down");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n          ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","menu-items");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("          ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    \n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"class","map-data");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","map-header");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","latest cards-layout cards-layout-one-column cards-layout-no-bot-pad");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cards cards-serif cards-three-up cards-carousel");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element6 = dom.childAt(fragment, [0, 1]);
        var element7 = dom.childAt(element6, [1]);
        var element8 = dom.childAt(element7, [1, 3]);
        var element9 = dom.childAt(element8, [3]);
        var element10 = dom.childAt(element8, [7]);
        var element11 = dom.childAt(element8, [11]);
        var element12 = dom.childAt(element8, [13]);
        var element13 = dom.childAt(element7, [5, 3, 0]);
        var element14 = dom.childAt(fragment, [2]);
        var element15 = dom.childAt(element14, [1, 1, 1]);
        var morphs = new Array(14);
        morphs[0] = dom.createAttrMorph(element6, 'style');
        morphs[1] = dom.createMorphAt(dom.childAt(element9, [1, 1]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element9, [3]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element10, [1, 1]),0,0);
        morphs[4] = dom.createMorphAt(dom.childAt(element10, [3]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element11, [1, 1]),0,0);
        morphs[6] = dom.createMorphAt(dom.childAt(element11, [3]),1,1);
        morphs[7] = dom.createElementMorph(element12);
        morphs[8] = dom.createMorphAt(dom.childAt(element7, [3, 1, 1, 1]),1,1);
        morphs[9] = dom.createAttrMorph(element13, 'src');
        morphs[10] = dom.createMorphAt(dom.childAt(element15, [1]),1,1);
        morphs[11] = dom.createMorphAt(dom.childAt(element15, [3]),1,1);
        morphs[12] = dom.createMorphAt(dom.childAt(element14, [3, 1, 1]),1,1);
        morphs[13] = dom.createMorphAt(dom.childAt(fragment, [4, 1]),1,1);
        return morphs;
      },
      statements: [
        ["attribute","style",["concat",["background-image: url(",["get","constants.staticS3Url",["loc",[null,[2,62],[2,83]]]],"/v_2016/images/hero-restaurant-landing.jpg);"]]],
        ["block","if",[["get","cityName",["loc",[null,[11,22],[11,30]]]]],[],0,1,["loc",[null,[11,16],[15,23]]]],
        ["block","each",[["get","cities",["loc",[null,[22,22],[22,28]]]]],[],2,null,["loc",[null,[22,14],[26,23]]]],
        ["content","neighborhoodLabel",["loc",[null,[34,40],[34,61]]]],
        ["block","if",[["get","neighborhoods",["loc",[null,[41,20],[41,33]]]]],[],3,4,["loc",[null,[41,14],[52,21]]]],
        ["content","cuisineLabel",["loc",[null,[60,40],[60,56]]]],
        ["block","if",[["get","cuisines",["loc",[null,[66,20],[66,28]]]]],[],5,6,["loc",[null,[66,14],[77,21]]]],
        ["element","action",["search"],["on","click"],["loc",[null,[81,35],[81,65]]]],
        ["content","restaurants-map-search",["loc",[null,[90,12],[90,38]]]],
        ["attribute","src",["concat",[["get","constants.staticS3Url",["loc",[null,[99,76],[99,97]]]],"/v_2016/images/app-store.png"]]],
        ["content","cityName",["loc",[null,[111,12],[111,24]]]],
        ["block","each",[["get","cities",["loc",[null,[115,20],[115,26]]]]],[],7,null,["loc",[null,[115,12],[119,21]]]],
        ["content","restaurants-map-search",["loc",[null,[128,8],[128,34]]]],
        ["block","if",[["get","loadingCollections",["loc",[null,[137,10],[137,28]]]]],[],8,9,["loc",[null,[137,4],[149,11]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6, child7, child8, child9]
    };
  }()));

});
define('dine/templates/components/restaurant-map', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/restaurant-map.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","restaurantsMap");
        dom.setAttribute(el1,"class","map");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/restaurants-list', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 11,
                "column": 12
              },
              "end": {
                "line": 15,
                "column": 12
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"class","menu-link");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element8 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element8);
            morphs[1] = dom.createMorphAt(element8,1,1);
            return morphs;
          },
          statements: [
            ["element","bind-attr",[],["href","view.href"],["loc",[null,[12,17],[12,47]]]],
            ["content","city.title",["loc",[null,[13,16],[13,30]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 10
            },
            "end": {
              "line": 16,
              "column": 10
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","link-to",["city.restaurants",["get","city.slug",["loc",[null,[11,42],[11,51]]]],"all","all",["subexpr","query-params",[],["searchQuery",["get","searchQuery",["loc",[null,[11,90],[11,101]]]]],["loc",[null,[11,64],[11,102]]]]],["class","menu-item","tagName","li","href",false],0,null,["loc",[null,[11,12],[15,24]]]]
        ],
        locals: ["city"],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 21,
              "column": 6
            },
            "end": {
              "line": 23,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          var el2 = dom.createTextNode("Lists");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 6
            },
            "end": {
              "line": 27,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","active");
          var el2 = dom.createTextNode("Restaurants");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 30,
              "column": 4
            },
            "end": {
              "line": 38,
              "column": 2
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("section");
          dom.setAttribute(el1,"class","map-data without-map");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","map-header");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","container");
          var el4 = dom.createTextNode("\n                  ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1, 1]),1,1);
          return morphs;
        },
        statements: [
          ["inline","restaurants-map-search",[],["searchQuery",["subexpr","@mut",[["get","searchQuery",["loc",[null,[34,55],[34,66]]]]],[],[]]],["loc",[null,[34,18],[34,68]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 55,
                "column": 10
              },
              "end": {
                "line": 57,
                "column": 10
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"class","menu-link");
            var el2 = dom.createTextNode("All");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element7 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element7);
            return morphs;
          },
          statements: [
            ["element","bind-attr",[],["href","view.href"],["loc",[null,[56,15],[56,45]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@2.0.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 59,
                  "column": 12
                },
                "end": {
                  "line": 63,
                  "column": 12
                }
              },
              "moduleName": "dine/templates/components/restaurants-list.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("a");
              dom.setAttribute(el1,"class","menu-link");
              var el2 = dom.createTextNode("\n                ");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n              ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element6 = dom.childAt(fragment, [1]);
              var morphs = new Array(2);
              morphs[0] = dom.createElementMorph(element6);
              morphs[1] = dom.createMorphAt(element6,1,1);
              return morphs;
            },
            statements: [
              ["element","bind-attr",[],["href","view.href"],["loc",[null,[60,17],[60,47]]]],
              ["content","neighborhood.name",["loc",[null,[61,16],[61,37]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 58,
                "column": 10
              },
              "end": {
                "line": 64,
                "column": 10
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [
            ["block","link-to",["city.restaurants",["get","citySlug",["loc",[null,[59,42],[59,50]]]],["get","neighborhood.slug",["loc",[null,[59,51],[59,68]]]],"all",["subexpr","query-params",[],["searchQuery",["get","searchQuery",["loc",[null,[59,101],[59,112]]]]],["loc",[null,[59,75],[59,113]]]]],["tagName","li"],0,null,["loc",[null,[59,12],[63,24]]]]
          ],
          locals: ["neighborhood"],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 54,
              "column": 8
            },
            "end": {
              "line": 65,
              "column": 8
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          morphs[1] = dom.createMorphAt(fragment,1,1,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","link-to",["city.restaurants",["get","citySlug",["loc",[null,[55,40],[55,48]]]],"all","all",["subexpr","query-params",[],["searchQuery",["get","searchQuery",["loc",[null,[55,87],[55,98]]]]],["loc",[null,[55,61],[55,99]]]]],["tagName","li"],0,null,["loc",[null,[55,10],[57,22]]]],
          ["block","each",[["get","neighborhoods",["loc",[null,[58,18],[58,31]]]]],[],1,null,["loc",[null,[58,10],[64,19]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child5 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 65,
              "column": 8
            },
            "end": {
              "line": 67,
              "column": 8
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("Select a city...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child6 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 79,
                "column": 10
              },
              "end": {
                "line": 83,
                "column": 10
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"class","menu-link");
            var el2 = dom.createTextNode("\n              All\n            ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element5 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element5);
            return morphs;
          },
          statements: [
            ["element","bind-attr",[],["href","view.href"],["loc",[null,[80,15],[80,45]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@2.0.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 85,
                  "column": 12
                },
                "end": {
                  "line": 89,
                  "column": 12
                }
              },
              "moduleName": "dine/templates/components/restaurants-list.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("a");
              dom.setAttribute(el1,"class","menu-link");
              var el2 = dom.createTextNode("\n                ");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n              ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element4 = dom.childAt(fragment, [1]);
              var morphs = new Array(2);
              morphs[0] = dom.createElementMorph(element4);
              morphs[1] = dom.createMorphAt(element4,1,1);
              return morphs;
            },
            statements: [
              ["element","bind-attr",[],["href","view.href"],["loc",[null,[86,17],[86,47]]]],
              ["content","cuisine.name",["loc",[null,[87,16],[87,32]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 84,
                "column": 10
              },
              "end": {
                "line": 90,
                "column": 10
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [
            ["block","link-to",["city.restaurants",["get","citySlug",["loc",[null,[85,42],[85,50]]]],["get","neighborhoodSlug",["loc",[null,[85,51],[85,67]]]],["get","cuisine.slug",["loc",[null,[85,68],[85,80]]]],["subexpr","query-params",[],["searchQuery",["get","searchQuery",["loc",[null,[85,107],[85,118]]]]],["loc",[null,[85,81],[85,119]]]]],["tagName","li"],0,null,["loc",[null,[85,12],[89,24]]]]
          ],
          locals: ["cuisine"],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 78,
              "column": 8
            },
            "end": {
              "line": 91,
              "column": 8
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          morphs[1] = dom.createMorphAt(fragment,1,1,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","link-to",["city.restaurants",["get","citySlug",["loc",[null,[79,40],[79,48]]]],["get","neighborhoodSlug",["loc",[null,[79,49],[79,65]]]],"all",["subexpr","query-params",[],["searchQuery",["get","searchQuery",["loc",[null,[79,98],[79,109]]]]],["loc",[null,[79,72],[79,110]]]]],["tagName","li"],0,null,["loc",[null,[79,10],[83,22]]]],
          ["block","each",[["get","cuisines",["loc",[null,[84,18],[84,26]]]]],[],1,null,["loc",[null,[84,10],[90,19]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child7 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 91,
              "column": 8
            },
            "end": {
              "line": 93,
              "column": 8
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("Select a neighborhood...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child8 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 105,
                "column": 10
              },
              "end": {
                "line": 107,
                "column": 10
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"class","menu-link");
            var el2 = dom.createTextNode("All");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element3);
            return morphs;
          },
          statements: [
            ["element","bind-attr",[],["href","view.href"],["loc",[null,[106,15],[106,45]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@2.0.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 109,
                  "column": 12
                },
                "end": {
                  "line": 113,
                  "column": 12
                }
              },
              "moduleName": "dine/templates/components/restaurants-list.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("a");
              dom.setAttribute(el1,"class","menu-link");
              var el2 = dom.createTextNode("\n                ");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n              ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element2 = dom.childAt(fragment, [1]);
              var morphs = new Array(2);
              morphs[0] = dom.createElementMorph(element2);
              morphs[1] = dom.createMorphAt(element2,1,1);
              return morphs;
            },
            statements: [
              ["element","bind-attr",[],["href","view.href"],["loc",[null,[110,17],[110,47]]]],
              ["content","feature.name",["loc",[null,[111,16],[111,32]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 108,
                "column": 10
              },
              "end": {
                "line": 114,
                "column": 10
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [
            ["block","link-to",["city.restaurantsWithFeatures",["get","citySlug",["loc",[null,[109,54],[109,62]]]],["get","neighborhoodSlug",["loc",[null,[109,63],[109,79]]]],["get","cuisineSlug",["loc",[null,[109,80],[109,91]]]],["get","feature.slug",["loc",[null,[109,92],[109,104]]]],["subexpr","query-params",[],["searchQuery",["get","searchQuery",["loc",[null,[109,131],[109,142]]]]],["loc",[null,[109,105],[109,143]]]]],["tagName","li"],0,null,["loc",[null,[109,12],[113,24]]]]
          ],
          locals: ["feature"],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 104,
              "column": 8
            },
            "end": {
              "line": 115,
              "column": 8
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          morphs[1] = dom.createMorphAt(fragment,1,1,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","link-to",["city.restaurantsWithFeatures",["get","citySlug",["loc",[null,[105,52],[105,60]]]],["get","neighborhoodSlug",["loc",[null,[105,61],[105,77]]]],["get","cuisineSlug",["loc",[null,[105,78],[105,89]]]],"all",["subexpr","query-params",[],["searchQuery",["get","searchQuery",["loc",[null,[105,122],[105,133]]]]],["loc",[null,[105,96],[105,134]]]]],["tagName","li"],0,null,["loc",[null,[105,10],[107,22]]]],
          ["block","each",[["get","features",["loc",[null,[108,18],[108,26]]]]],[],1,null,["loc",[null,[108,10],[114,19]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child9 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 115,
              "column": 8
            },
            "end": {
              "line": 117,
              "column": 8
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("Select a cuisine...");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child10 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 125,
              "column": 8
            },
            "end": {
              "line": 129,
              "column": 8
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("\n        matching ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("b");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]),0,0);
          return morphs;
        },
        statements: [
          ["content","searchQuery",["loc",[null,[127,20],[127,35]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child11 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 177,
                "column": 16
              },
              "end": {
                "line": 179,
                "column": 16
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["inline","restaurant-card",[],["restaurant",["subexpr","@mut",[["get","restaurant",["loc",[null,[178,47],[178,57]]]]],[],[]]],["loc",[null,[178,18],[178,59]]]]
          ],
          locals: ["restaurant"],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 183,
                "column": 12
              },
              "end": {
                "line": 189,
                "column": 12
              }
            },
            "moduleName": "dine/templates/components/restaurants-list.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","cta-wrapper");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"class","btn pink");
            var el3 = dom.createTextNode("\n                  Load More\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1, 1]);
            var morphs = new Array(1);
            morphs[0] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [
            ["element","action",["loadMore"],["on","click"],["loc",[null,[185,41],[185,73]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 171,
              "column": 6
            },
            "end": {
              "line": 192,
              "column": 6
            }
          },
          "moduleName": "dine/templates/components/restaurants-list.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","card-results js-results");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment(" Restaurants: Two Up Cards ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","cards cards-two-up cards-map-app cards-mobile-micro cards-sans-serif");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","inner");
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","card-container filter-card-holder");
          var el5 = dom.createTextNode("\n");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("              ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 3]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 1]),1,1);
          morphs[1] = dom.createMorphAt(element1,3,3);
          return morphs;
        },
        statements: [
          ["block","each",[["get","paginatedResults",["loc",[null,[177,24],[177,40]]]]],[],0,null,["loc",[null,[177,16],[179,25]]]],
          ["block","if",[["get","showLoadMore",["loc",[null,[183,18],[183,30]]]]],[],1,null,["loc",[null,[183,12],[189,19]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 196,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/restaurants-list.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","map-app-filtering");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","top-filters cf");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","city-filters");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","menu");
        dom.setAttribute(el4,"tabindex","1");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","current-item");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","icon icon-arrow-down");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5,"class","menu-items");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","filter-toggle-tabs");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" For the filters when one is selected an event is fired\n  $('body').trigger('dropdown-change', val); if you want want to customize the filters listen using $('body').on('dropdown-change', function(event, value) {});\n\n  Some filtering already exists, take out these if you don't want to use it:  data-behaviour=\"filter-card\" and  filter-card-holder\n  data-sharecount=\"100\" data-date=\"September 10, 2015\" data-type=\"~breakfast~brunch~\" on the cards enable them for filtering.\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","restaurant-filtering js-restaurant-filtering cf");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","dropdown js-dropdown");
        dom.setAttribute(el3,"tabindex","2");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","dropdown-active");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","active-item");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el5 = dom.createElement("svg");
        dom.setAttribute(el5,"version","1.0");
        dom.setAttribute(el5,"id","Layer_1");
        dom.setAttribute(el5,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el5,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el5,"x","0px");
        dom.setAttribute(el5,"y","0px");
        dom.setAttribute(el5,"viewBox","0 0 36 36");
        dom.setAttribute(el5,"style","enable-background:new 0 0 36 36;");
        dom.setAttributeNS(el5,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("polygon");
        dom.setAttribute(el6,"id","XMLID_2_");
        dom.setAttribute(el6,"points","5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 ");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.setNamespace(null);
        var el4 = dom.createElement("ul");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","dropdown js-dropdown");
        dom.setAttribute(el3,"tabindex","3");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","dropdown-active");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","active-item");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el5 = dom.createElement("svg");
        dom.setAttribute(el5,"version","1.0");
        dom.setAttribute(el5,"id","Layer_1");
        dom.setAttribute(el5,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el5,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el5,"x","0px");
        dom.setAttribute(el5,"y","0px");
        dom.setAttribute(el5,"viewBox","0 0 36 36");
        dom.setAttribute(el5,"style","enable-background:new 0 0 36 36;");
        dom.setAttributeNS(el5,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("polygon");
        dom.setAttribute(el6,"id","XMLID_2_");
        dom.setAttribute(el6,"points","5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 ");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.setNamespace(null);
        var el4 = dom.createElement("ul");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","dropdown js-dropdown");
        dom.setAttribute(el3,"tabindex","4");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","dropdown-active");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","active-item");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el5 = dom.createElement("svg");
        dom.setAttribute(el5,"version","1.0");
        dom.setAttribute(el5,"id","Layer_1");
        dom.setAttribute(el5,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el5,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el5,"x","0px");
        dom.setAttribute(el5,"y","0px");
        dom.setAttribute(el5,"viewBox","0 0 36 36");
        dom.setAttribute(el5,"style","enable-background:new 0 0 36 36;");
        dom.setAttributeNS(el5,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("polygon");
        dom.setAttribute(el6,"id","XMLID_2_");
        dom.setAttribute(el6,"points","5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 ");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.setNamespace(null);
        var el4 = dom.createElement("ul");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cards-listings cf");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cards-listings-wrapper");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","card-search-terms");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" div class=\"card-sorting\">\n        <div class=\"return js-return hidden\">\n          <a href=\"\" class=\"back\">Back</a>\n        </div>\n        <div class=\"sort-by js-sort\">\n          <span class=\"\">Sort by: </span>\n          <div class=\"dropdown js-dropdown\" data-behaviour=\"filter-card\">\n            <div class=\"dropdown-active\">\n              <span class=\"active-item\">Latest\n              </span>\n              <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 36 36\" style=\"enable-background:new 0 0 36 36;\" xml:space=\"preserve\">\n                <polygon id=\"XMLID_2_\" points=\"5.3,13.5 7.4,11.4 18,22 28.6,11.4 30.7,13.5 18,26.2 \"></polygon>\n              </svg>\n            </div>\n            <ul>\n              <li data-value=\"recent\">latest</li>\n              <li data-value=\"popularity\">Popularity</li>\n              <li data-value=\"price\">Price</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"filter-layout js-layout-switch\">\n          <div class=\"toggle-controls\">\n            <ul>\n              <li class=\"js-layout \" data-filter-layout=\"rows\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid\" width=\"20\" height=\"14\" viewBox=\"0 0 20 14\">\n                  <path d=\"M6.188,14.000 L6.188,10.281 L20.000,10.281 L20.000,14.000 L6.188,14.000 ZM6.188,5.188 L20.000,5.188 L20.000,8.812 L6.188,8.812 L6.188,5.188 ZM6.188,0.000 L20.000,0.000 L20.000,3.719 L6.188,3.719 L6.188,0.000 ZM-0.000,10.281 L4.594,10.281 L4.594,14.000 L-0.000,14.000 L-0.000,10.281 ZM-0.000,5.188 L4.594,5.188 L4.594,8.812 L-0.000,8.812 L-0.000,5.188 ZM-0.000,0.000 L4.594,0.000 L4.594,3.719 L-0.000,3.719 L-0.000,0.000 Z\" class=\"cls-1\"/>\n                </svg>\n              </li>\n              <li class=\"js-layout active\" data-filter-layout=\"grid\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid\" width=\"15\" height=\"13\" viewBox=\"0 0 15 13\">\n                  <path d=\"M8.406,13.000 L8.406,7.437 L15.000,7.437 L15.000,13.000 L8.406,13.000 ZM8.406,-0.000 L15.000,-0.000 L15.000,5.563 L8.406,5.563 L8.406,-0.000 ZM-0.000,7.437 L6.594,7.437 L6.594,13.000 L-0.000,13.000 L-0.000,7.437 ZM-0.000,-0.000 L6.594,-0.000 L6.594,5.563 L-0.000,5.563 L-0.000,-0.000 Z\" class=\"cls-1\"/>\n                </svg>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element9 = dom.childAt(fragment, [0]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element10, [1, 1]);
        var element12 = dom.childAt(element10, [3]);
        var element13 = dom.childAt(element9, [7]);
        var element14 = dom.childAt(element13, [1]);
        var element15 = dom.childAt(element13, [3]);
        var element16 = dom.childAt(element13, [5]);
        var element17 = dom.childAt(element9, [9, 1]);
        var element18 = dom.childAt(element17, [1]);
        var morphs = new Array(14);
        morphs[0] = dom.createMorphAt(dom.childAt(element11, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element11, [3]),1,1);
        morphs[2] = dom.createMorphAt(element12,1,1);
        morphs[3] = dom.createMorphAt(element12,3,3);
        morphs[4] = dom.createMorphAt(element9,3,3);
        morphs[5] = dom.createMorphAt(dom.childAt(element14, [1, 1]),0,0);
        morphs[6] = dom.createMorphAt(dom.childAt(element14, [3]),1,1);
        morphs[7] = dom.createMorphAt(dom.childAt(element15, [1, 1]),0,0);
        morphs[8] = dom.createMorphAt(dom.childAt(element15, [3]),1,1);
        morphs[9] = dom.createMorphAt(dom.childAt(element16, [1, 1]),0,0);
        morphs[10] = dom.createMorphAt(dom.childAt(element16, [3]),1,1);
        morphs[11] = dom.createMorphAt(dom.childAt(element18, [1]),0,0);
        morphs[12] = dom.createMorphAt(element18,3,3);
        morphs[13] = dom.createMorphAt(element17,5,5);
        return morphs;
      },
      statements: [
        ["content","cityName",["loc",[null,[6,10],[6,22]]]],
        ["block","each",[["get","cities",["loc",[null,[10,18],[10,24]]]]],[],0,null,["loc",[null,[10,10],[16,19]]]],
        ["block","link-to",["city.collections",["get","citySlug",["loc",[null,[21,36],[21,44]]]]],[],1,null,["loc",[null,[21,6],[23,18]]]],
        ["block","link-to",["city.restaurantsWithFeatures",["get","citySlug",["loc",[null,[25,48],[25,56]]]],["get","neighborhoodSlug",["loc",[null,[25,57],[25,73]]]],["get","cuisineSlug",["loc",[null,[25,74],[25,85]]]],["get","featureSlug",["loc",[null,[25,86],[25,97]]]]],[],2,null,["loc",[null,[25,6],[27,18]]]],
        ["block","is-mobile",[],["show",true],3,null,["loc",[null,[30,4],[38,16]]]],
        ["content","neighborhoodLabel",["loc",[null,[48,34],[48,55]]]],
        ["block","if",[["get","neighborhoods",["loc",[null,[54,14],[54,27]]]]],[],4,5,["loc",[null,[54,8],[67,15]]]],
        ["content","cuisineLabel",["loc",[null,[72,34],[72,50]]]],
        ["block","if",[["get","cuisines",["loc",[null,[78,14],[78,22]]]]],[],6,7,["loc",[null,[78,8],[93,15]]]],
        ["content","featureLabel",["loc",[null,[98,34],[98,50]]]],
        ["block","if",[["get","features",["loc",[null,[104,14],[104,22]]]]],[],8,9,["loc",[null,[104,8],[117,15]]]],
        ["content","resultMessage",["loc",[null,[124,12],[124,29]]]],
        ["block","if",[["get","searchQuery",["loc",[null,[125,14],[125,25]]]]],[],10,null,["loc",[null,[125,8],[129,15]]]],
        ["block","if",[["get","restaurants.length",["loc",[null,[171,12],[171,30]]]]],[],11,null,["loc",[null,[171,6],[192,13]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6, child7, child8, child9, child10, child11]
    };
  }()));

});
define('dine/templates/components/restaurants-map-search', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 12,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/restaurants-map-search.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","map-search");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("form");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3,"placeholder","Search Restaurants");
        dom.setAttribute(el3,"name","searchRestaurants");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el2 = dom.createElement("svg");
        dom.setAttribute(el2,"version","1.1");
        dom.setAttribute(el2,"id","icons");
        dom.setAttribute(el2,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el2,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el2,"x","0px");
        dom.setAttribute(el2,"y","0px");
        dom.setAttribute(el2,"viewBox","0 0 55 57.5");
        dom.setAttribute(el2,"style","enable-background:new 0 0 55 57.5;");
        dom.setAttributeNS(el2,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("g");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("circle");
        dom.setAttribute(el4,"cx","21.5");
        dom.setAttribute(el4,"cy","22");
        dom.setAttribute(el4,"r","16");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("line");
        dom.setAttribute(el4,"x1","32.9");
        dom.setAttribute(el4,"y1","33.3");
        dom.setAttribute(el4,"x2","48.5");
        dom.setAttribute(el4,"y2","49");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 1]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element1, 'value');
        morphs[1] = dom.createElementMorph(element2);
        return morphs;
      },
      statements: [
        ["attribute","value",["get","searchQuery",["loc",[null,[3,77],[3,88]]]]],
        ["element","action",["searchAction"],[],["loc",[null,[5,212],[5,237]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/restaurants-map', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 54,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/restaurants-map.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","map-data");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","map-header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","notifications");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","notification-icon new js-notification-icon");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el6 = dom.createElement("svg");
        dom.setAttribute(el6,"version","1.1");
        dom.setAttribute(el6,"id","Layer_1");
        dom.setAttribute(el6,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el6,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el6,"x","0px");
        dom.setAttribute(el6,"y","0px");
        dom.setAttribute(el6,"width","86.75px");
        dom.setAttribute(el6,"height","96.565px");
        dom.setAttribute(el6,"viewBox","0 0 86.75 96.565");
        dom.setAttribute(el6,"enable-background","new 0 0 86.75 96.565");
        dom.setAttributeNS(el6,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("g");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("defs");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("rect");
        dom.setAttribute(el9,"id","SVGID_1_");
        dom.setAttribute(el9,"width","86.75");
        dom.setAttribute(el9,"height","96.565");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("clipPath");
        dom.setAttribute(el8,"id","SVGID_2_");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("use");
        dom.setAttributeNS(el9,"http://www.w3.org/1999/xlink","xlink:href","#SVGID_1_");
        dom.setAttribute(el9,"overflow","visible");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("path");
        dom.setAttribute(el8,"clip-path","url(#SVGID_2_)");
        dom.setAttribute(el8,"d","M74.307,55.264c0-0.061,0.009-0.118,0.009-0.179h-0.009V36.918h-0.065\n              c-0.58-14.141-10.637-25.813-23.993-28.854V6.849C50.234,3.064,47.163,0,43.375,0c-3.788,0-6.86,3.064-6.874,6.849v1.215\n              c-13.356,3.041-23.412,14.713-23.993,28.854h-0.065v18.167h-0.009c0.001,0.061,0.009,0.118,0.009,0.179\n              c0,8.646-5.099,16.083-12.443,19.521v12.298h29.277c2.269,5.561,7.722,9.481,14.098,9.481c6.375,0,11.828-3.921,14.099-9.481H86.75\n              V74.786C79.405,71.347,74.307,63.91,74.307,55.264");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n\n          ");
        dom.appendChild(el5, el6);
        dom.setNamespace(null);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","notifications-list");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("ul");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","");
        var el10 = dom.createTextNode("\n                  Add these August openins to your summer bucket list\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("span");
        dom.setAttribute(el10,"class","js-dismiss-notification");
        var el11 = dom.createTextNode("Dismiss");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","");
        var el10 = dom.createTextNode("\n                  Add these August openins to your summer bucket list, this is a longer example\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("span");
        dom.setAttribute(el10,"class","js-dismiss-notification");
        var el11 = dom.createTextNode("Dismiss");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("li");
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","");
        var el10 = dom.createTextNode("\n                  Add these August openins to your summer bucket list\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("span");
        dom.setAttribute(el10,"class","js-dismiss-notification");
        var el11 = dom.createTextNode("Dismiss");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","map");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","app-cta");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","https://bnc.lt/restaurantsDine");
        dom.setAttribute(el3,"class","arrow-after");
        var el4 = dom.createTextNode("Explore on-the-go with the DINE app ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("i");
        dom.setAttribute(el4,"class","icon icon-arrow-right");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        return morphs;
      },
      statements: [
        ["inline","restaurants-map-search",[],["searchQuery",["subexpr","@mut",[["get","searchQuery",["loc",[null,[4,43],[4,54]]]]],[],[]]],["loc",[null,[4,6],[4,56]]]],
        ["inline","restaurant-map",[],["entries",["subexpr","@mut",[["get","entries",["loc",[null,[48,29],[48,36]]]]],[],[]]],["loc",[null,[48,4],[48,38]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/search-auto-complete', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/search-auto-complete.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/smart-app-banner', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/smart-app-banner.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/components/updates-feed', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@2.0.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 7,
                  "column": 12
                },
                "end": {
                  "line": 9,
                  "column": 12
                }
              },
              "moduleName": "dine/templates/components/updates-feed.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("img");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element0 = dom.childAt(fragment, [1]);
              var morphs = new Array(2);
              morphs[0] = dom.createAttrMorph(element0, 'src');
              morphs[1] = dom.createAttrMorph(element0, 'alt');
              return morphs;
            },
            statements: [
              ["attribute","src",["concat",[["get","update.imageURL",["loc",[null,[8,26],[8,41]]]]]]],
              ["attribute","alt",["concat",[["get","update.title",["loc",[null,[8,52],[8,64]]]]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 6,
                "column": 10
              },
              "end": {
                "line": 14,
                "column": 10
              }
            },
            "moduleName": "dine/templates/components/updates-feed.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","label");
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("h3");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [2]);
            var morphs = new Array(3);
            morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
            morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
            morphs[2] = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
            dom.insertBoundary(fragment, 0);
            return morphs;
          },
          statements: [
            ["block","link-to",["city.restaurant",["get","update.citySlug",["loc",[null,[7,41],[7,56]]]],["get","update.restaurantSlug",["loc",[null,[7,57],[7,78]]]]],[],0,null,["loc",[null,[7,12],[9,24]]]],
            ["content","update.title",["loc",[null,[11,18],[11,34]]]],
            ["content","update.subheader2",["loc",[null,[12,17],[12,38]]]]
          ],
          locals: [],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 26,
              "column": 2
            }
          },
          "moduleName": "dine/templates/components/updates-feed.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","update-card");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","card");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","header");
          var el4 = dom.createTextNode("\n");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","description");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h3");
          var el5 = dom.createTextNode("\n            ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n            ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("small");
          var el6 = dom.createTextNode("(");
          dom.appendChild(el5, el6);
          var el6 = dom.createComment("");
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode(")");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n          ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("h4");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("p");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1, 1]);
          var element3 = dom.childAt(element2, [3]);
          var element4 = dom.childAt(element3, [1]);
          var morphs = new Array(6);
          morphs[0] = dom.createElementMorph(element2);
          morphs[1] = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
          morphs[2] = dom.createMorphAt(element4,1,1);
          morphs[3] = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
          morphs[4] = dom.createMorphAt(dom.childAt(element3, [3]),0,0);
          morphs[5] = dom.createMorphAt(dom.childAt(element3, [5]),0,0);
          return morphs;
        },
        statements: [
          ["element","action",["goToUpdatePage",["get","update",["loc",[null,[4,50],[4,56]]]]],["on","click"],["loc",[null,[4,24],[4,69]]]],
          ["block","unless",[["get","update.isCollection",["loc",[null,[6,20],[6,39]]]]],[],0,null,["loc",[null,[6,10],[14,21]]]],
          ["content","update.header",["loc",[null,[18,12],[18,29]]]],
          ["inline","moment-from-now",[["get","update.publishDate",["loc",[null,[19,38],[19,56]]]]],[],["loc",[null,[19,20],[19,58]]]],
          ["content","update.subheader",["loc",[null,[21,14],[21,34]]]],
          ["content","update.body",["loc",[null,[22,13],[22,28]]]]
        ],
        locals: ["update"],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 29,
            "column": 0
          }
        },
        "moduleName": "dine/templates/components/updates-feed.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        return morphs;
      },
      statements: [
        ["block","each",[["get","updates",["loc",[null,[2,10],[2,17]]]]],[],0,null,["loc",[null,[2,2],[26,11]]]],
        ["content","yield",["loc",[null,[28,0],[28,9]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('dine/templates/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dine/templates/loading.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","loading-indicator",["loc",[null,[1,0],[1,21]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/updates/city', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "dine/templates/updates/city.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","smart-app-banner",["loc",[null,[1,0],[1,20]]]],
        ["inline","updates-feed",[],["updates",["subexpr","@mut",[["get","model",["loc",[null,[2,23],[2,28]]]]],[],[]]],["loc",[null,[2,0],[2,30]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dine/templates/updates', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@2.0.0",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 14
              },
              "end": {
                "line": 11,
                "column": 14
              }
            },
            "moduleName": "dine/templates/updates.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","city.title",["loc",[null,[10,16],[10,30]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@2.0.0",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 10
            },
            "end": {
              "line": 13,
              "column": 10
            }
          },
          "moduleName": "dine/templates/updates.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["block","link-to",["updates.city",["get","city.slug",["loc",[null,[9,40],[9,49]]]]],[],0,null,["loc",[null,[9,14],[11,26]]]]
        ],
        locals: ["city"],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "dine/templates/updates.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-sm-12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","main-content");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1, 1, 1, 1]),1,1);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","smart-app-banner",["loc",[null,[1,0],[1,20]]]],
        ["block","each",[["get","model",["loc",[null,[7,18],[7,23]]]]],[],0,null,["loc",[null,[7,10],[13,19]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('dine/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('dine/tests/components/collection-card.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/collection-card.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/collection-card.js should pass jshint.'); 
  });

});
define('dine/tests/components/collection-restaurants-list.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/collection-restaurants-list.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'components/collection-restaurants-list.js should pass jshint.\ncomponents/collection-restaurants-list.js: line 1, col 58, Missing semicolon.\n\n1 error'); 
  });

});
define('dine/tests/components/collections-list.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/collections-list.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'components/collections-list.js should pass jshint.\ncomponents/collections-list.js: line 1, col 58, Missing semicolon.\n\n1 error'); 
  });

});
define('dine/tests/components/dfp-ad.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/dfp-ad.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/dfp-ad.js should pass jshint.'); 
  });

});
define('dine/tests/components/is-mobile.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/is-mobile.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/is-mobile.js should pass jshint.'); 
  });

});
define('dine/tests/components/loading-indicator.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/loading-indicator.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/loading-indicator.js should pass jshint.'); 
  });

});
define('dine/tests/components/modal-popup.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/modal-popup.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/modal-popup.js should pass jshint.'); 
  });

});
define('dine/tests/components/restaurant-card.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/restaurant-card.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/restaurant-card.js should pass jshint.'); 
  });

});
define('dine/tests/components/restaurant-landing.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/restaurant-landing.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/restaurant-landing.js should pass jshint.'); 
  });

});
define('dine/tests/components/restaurant-map.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/restaurant-map.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'components/restaurant-map.js should pass jshint.\ncomponents/restaurant-map.js: line 77, col 9, \'section\' is defined but never used.\ncomponents/restaurant-map.js: line 76, col 43, \'hide\' is defined but never used.\ncomponents/restaurant-map.js: line 86, col 26, \'google\' is not defined.\ncomponents/restaurant-map.js: line 146, col 33, \'google\' is not defined.\n\n4 errors'); 
  });

});
define('dine/tests/components/restaurants-list.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/restaurants-list.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/restaurants-list.js should pass jshint.'); 
  });

});
define('dine/tests/components/restaurants-map-search.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/restaurants-map-search.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/restaurants-map-search.js should pass jshint.'); 
  });

});
define('dine/tests/components/restaurants-map.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/restaurants-map.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/restaurants-map.js should pass jshint.'); 
  });

});
define('dine/tests/components/search-auto-complete.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/search-auto-complete.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'components/search-auto-complete.js should pass jshint.\ncomponents/search-auto-complete.js: line 3, col 16, \'Ember\' is not defined.\ncomponents/search-auto-complete.js: line 1, col 8, \'AutoComplete\' is defined but never used.\n\n2 errors'); 
  });

});
define('dine/tests/components/smart-app-banner.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/smart-app-banner.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/smart-app-banner.js should pass jshint.'); 
  });

});
define('dine/tests/components/updates-feed.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/updates-feed.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'components/updates-feed.js should pass jshint.'); 
  });

});
define('dine/tests/controllers/city/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/city');
  QUnit.test('controllers/city/index.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/city/index.js should pass jshint.'); 
  });

});
define('dine/tests/controllers/city/neighborhood.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/city');
  QUnit.test('controllers/city/neighborhood.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/city/neighborhood.js should pass jshint.'); 
  });

});
define('dine/tests/controllers/city/restaurants-with-features.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/city');
  QUnit.test('controllers/city/restaurants-with-features.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/city/restaurants-with-features.js should pass jshint.'); 
  });

});
define('dine/tests/controllers/city/restaurants.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/city');
  QUnit.test('controllers/city/restaurants.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/city/restaurants.js should pass jshint.'); 
  });

});
define('dine/tests/controllers/city.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/city.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'controllers/city.js should pass jshint.'); 
  });

});
define('dine/tests/helpers/is-equal.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/is-equal.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'helpers/is-equal.js should pass jshint.'); 
  });

});
define('dine/tests/helpers/resolver', ['exports', 'ember/resolver', 'dine/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('dine/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('dine/tests/helpers/start-app', ['exports', 'ember', 'dine/app', 'dine/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('dine/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('dine/tests/initializers/component-router-injector.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/component-router-injector.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'initializers/component-router-injector.js should pass jshint.'); 
  });

});
define('dine/tests/initializers/constants.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/constants.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'initializers/constants.js should pass jshint.'); 
  });

});
define('dine/tests/initializers/dfp.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/dfp.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'initializers/dfp.js should pass jshint.'); 
  });

});
define('dine/tests/initializers/init.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/init.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'initializers/init.js should pass jshint.\ninitializers/init.js: line 4, col 39, \'application\' is defined but never used.\ninitializers/init.js: line 4, col 28, \'container\' is defined but never used.\ninitializers/init.js: line 13, col 8, \'jQuery\' is not defined.\n\n3 errors'); 
  });

});
define('dine/tests/initializers/nprogress.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/nprogress.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'initializers/nprogress.js should pass jshint.\ninitializers/nprogress.js: line 3, col 39, \'application\' is defined but never used.\ninitializers/nprogress.js: line 3, col 28, \'container\' is defined but never used.\ninitializers/nprogress.js: line 1, col 8, \'config\' is defined but never used.\n\n3 errors'); 
  });

});
define('dine/tests/initializers/overrides.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/overrides.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'initializers/overrides.js should pass jshint.\ninitializers/overrides.js: line 3, col 7, \'Ember\' is not defined.\ninitializers/overrides.js: line 10, col 19, \'Ember\' is not defined.\ninitializers/overrides.js: line 11, col 18, \'Modernizr\' is not defined.\n\n3 errors'); 
  });

});
define('dine/tests/integration/components/collection-card-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('collection-card', 'Integration | Component | collection card', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 19
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'collection-card', ['loc', [null, [1, 0], [1, 19]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'collection-card', [], [], 0, null, ['loc', [null, [2, 4], [4, 24]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/collection-card-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/collection-card-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/collection-card-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/collection-restaurants-list-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('collection-restaurants-list', 'Integration | Component | collection restaurants list', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 31
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'collection-restaurants-list', ['loc', [null, [1, 0], [1, 31]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'collection-restaurants-list', [], [], 0, null, ['loc', [null, [2, 4], [4, 36]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/collection-restaurants-list-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/collection-restaurants-list-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/collection-restaurants-list-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/collections-list-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('collections-list', 'Integration | Component | collections list', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 20
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'collections-list', ['loc', [null, [1, 0], [1, 20]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'collections-list', [], [], 0, null, ['loc', [null, [2, 4], [4, 25]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/collections-list-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/collections-list-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/collections-list-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/dfp-ad-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('dfp-ad', 'Integration | Component | dfp ad', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 10
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'dfp-ad', ['loc', [null, [1, 0], [1, 10]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'dfp-ad', [], [], 0, null, ['loc', [null, [2, 4], [4, 15]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/dfp-ad-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/dfp-ad-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/dfp-ad-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/is-mobile-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('is-mobile', 'Integration | Component | is mobile', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 13
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'is-mobile', ['loc', [null, [1, 0], [1, 13]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'is-mobile', [], [], 0, null, ['loc', [null, [2, 4], [4, 18]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/is-mobile-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/is-mobile-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/is-mobile-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/loading-indicator-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('loading-indicator', 'Integration | Component | loading indicator', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 21
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'loading-indicator', ['loc', [null, [1, 0], [1, 21]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'loading-indicator', [], [], 0, null, ['loc', [null, [2, 4], [4, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/loading-indicator-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/loading-indicator-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/loading-indicator-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/modal-popup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('modal-popup', 'Integration | Component | modal popup', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 15
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'modal-popup', ['loc', [null, [1, 0], [1, 15]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'modal-popup', [], [], 0, null, ['loc', [null, [2, 4], [4, 20]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/modal-popup-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/modal-popup-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/modal-popup-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/restaurant-card-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('restaurant-card', 'Integration | Component | restaurant card', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 19
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'restaurant-card', ['loc', [null, [1, 0], [1, 19]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'restaurant-card', [], [], 0, null, ['loc', [null, [2, 4], [4, 24]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/restaurant-card-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/restaurant-card-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/restaurant-card-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/restaurant-landing-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('restaurant-landing', 'Integration | Component | restaurant landing', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 22
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'restaurant-landing', ['loc', [null, [1, 0], [1, 22]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'restaurant-landing', [], [], 0, null, ['loc', [null, [2, 4], [4, 27]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/restaurant-landing-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/restaurant-landing-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/restaurant-landing-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/restaurant-map-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('restaurant-map', 'Integration | Component | restaurant map', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 18
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'restaurant-map', ['loc', [null, [1, 0], [1, 18]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'restaurant-map', [], [], 0, null, ['loc', [null, [2, 4], [4, 23]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/restaurant-map-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/restaurant-map-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/restaurant-map-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/restaurants-list-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('restaurants-list', 'Integration | Component | restaurants list', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 20
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'restaurants-list', ['loc', [null, [1, 0], [1, 20]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'restaurants-list', [], [], 0, null, ['loc', [null, [2, 4], [4, 25]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/restaurants-list-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/restaurants-list-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/restaurants-list-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/restaurants-map-search-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('restaurants-map-search', 'Integration | Component | restaurants map search', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 26
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'restaurants-map-search', ['loc', [null, [1, 0], [1, 26]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'restaurants-map-search', [], [], 0, null, ['loc', [null, [2, 4], [4, 31]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/restaurants-map-search-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/restaurants-map-search-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/restaurants-map-search-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/restaurants-map-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('restaurants-map', 'Integration | Component | restaurants map', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 19
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'restaurants-map', ['loc', [null, [1, 0], [1, 19]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'restaurants-map', [], [], 0, null, ['loc', [null, [2, 4], [4, 24]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/restaurants-map-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/restaurants-map-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/restaurants-map-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/search-auto-complete-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('search-auto-complete', 'Integration | Component | search auto complete', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 24
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'search-auto-complete', ['loc', [null, [1, 0], [1, 24]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'search-auto-complete', [], [], 0, null, ['loc', [null, [2, 4], [4, 29]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/search-auto-complete-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/search-auto-complete-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/search-auto-complete-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/smart-app-banner-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('smart-app-banner', 'Integration | Component | smart app banner', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 20
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'smart-app-banner', ['loc', [null, [1, 0], [1, 20]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'smart-app-banner', [], [], 0, null, ['loc', [null, [2, 4], [4, 25]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/smart-app-banner-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/smart-app-banner-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/smart-app-banner-test.js should pass jshint.'); 
  });

});
define('dine/tests/integration/components/updates-feed-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('updates-feed', 'Integration | Component | updates feed', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 16
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'updates-feed', ['loc', [null, [1, 0], [1, 16]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@2.0.0',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@2.0.0',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'updates-feed', [], [], 0, null, ['loc', [null, [2, 4], [4, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('dine/tests/integration/components/updates-feed-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/updates-feed-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'integration/components/updates-feed-test.js should pass jshint.'); 
  });

});
define('dine/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('dine/tests/routes/city/collections/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city/collections');
  QUnit.test('routes/city/collections/index.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'routes/city/collections/index.js should pass jshint.\nroutes/city/collections/index.js: line 38, col 53, \'reject\' is defined but never used.\nroutes/city/collections/index.js: line 51, col 19, \'params\' is defined but never used.\nroutes/city/collections/index.js: line 48, col 7, \'reject\' is not defined.\nroutes/city/collections/index.js: line 61, col 7, \'reject\' is not defined.\n\n4 errors'); 
  });

});
define('dine/tests/routes/city/collections/restaurants/restaurant.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city/collections/restaurants');
  QUnit.test('routes/city/collections/restaurants/restaurant.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/city/collections/restaurants/restaurant.js should pass jshint.'); 
  });

});
define('dine/tests/routes/city/collections/restaurants.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city/collections');
  QUnit.test('routes/city/collections/restaurants.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'routes/city/collections/restaurants.js should pass jshint.\nroutes/city/collections/restaurants.js: line 28, col 53, \'reject\' is defined but never used.\nroutes/city/collections/restaurants.js: line 38, col 7, \'reject\' is not defined.\nroutes/city/collections/restaurants.js: line 52, col 7, \'reject\' is not defined.\n\n3 errors'); 
  });

});
define('dine/tests/routes/city/collections.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city');
  QUnit.test('routes/city/collections.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/city/collections.js should pass jshint.'); 
  });

});
define('dine/tests/routes/city/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city');
  QUnit.test('routes/city/index.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'routes/city/index.js should pass jshint.\nroutes/city/index.js: line 1, col 8, \'Ember\' is defined but never used.\n\n1 error'); 
  });

});
define('dine/tests/routes/city/restaurant.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city');
  QUnit.test('routes/city/restaurant.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'routes/city/restaurant.js should pass jshint.\nroutes/city/restaurant.js: line 29, col 53, \'reject\' is defined but never used.\nroutes/city/restaurant.js: line 45, col 66, Missing semicolon.\nroutes/city/restaurant.js: line 39, col 7, \'reject\' is not defined.\n\n3 errors'); 
  });

});
define('dine/tests/routes/city/restaurants-with-features.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city');
  QUnit.test('routes/city/restaurants-with-features.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/city/restaurants-with-features.js should pass jshint.'); 
  });

});
define('dine/tests/routes/city/restaurants.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/city');
  QUnit.test('routes/city/restaurants.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'routes/city/restaurants.js should pass jshint.\nroutes/city/restaurants.js: line 36, col 53, \'reject\' is defined but never used.\nroutes/city/restaurants.js: line 82, col 23, \'model\' is defined but never used.\nroutes/city/restaurants.js: line 46, col 7, \'reject\' is not defined.\n\n3 errors'); 
  });

});
define('dine/tests/routes/city.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/city.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/city.js should pass jshint.'); 
  });

});
define('dine/tests/routes/updates/city.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/updates');
  QUnit.test('routes/updates/city.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/updates/city.js should pass jshint.'); 
  });

});
define('dine/tests/routes/updates.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/updates.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'routes/updates.js should pass jshint.'); 
  });

});
define('dine/tests/services/api.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/api.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/api.js should pass jshint.'); 
  });

});
define('dine/tests/services/branch-metrics.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/branch-metrics.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'services/branch-metrics.js should pass jshint.\nservices/branch-metrics.js: line 36, col 77, Expected \'{\' and instead saw \'c\'.\nservices/branch-metrics.js: line 36, col 239, Missing semicolon.\nservices/branch-metrics.js: line 36, col 331, Missing semicolon.\nservices/branch-metrics.js: line 36, col 332, Missing semicolon.\nservices/branch-metrics.js: line 39, col 63, \'data\' is defined but never used.\nservices/branch-metrics.js: line 39, col 58, \'err\' is defined but never used.\nservices/branch-metrics.js: line 84, col 47, \'event\' is defined but never used.\nservices/branch-metrics.js: line 39, col 9, \'branch\' is not defined.\nservices/branch-metrics.js: line 40, col 31, \'branch\' is not defined.\nservices/branch-metrics.js: line 42, col 27, \'branch\' is not defined.\nservices/branch-metrics.js: line 89, col 9, \'branch\' is not defined.\nservices/branch-metrics.js: line 101, col 9, \'branch\' is not defined.\n\n12 errors'); 
  });

});
define('dine/tests/services/city.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/city.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/city.js should pass jshint.'); 
  });

});
define('dine/tests/services/constants.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/constants.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'services/constants.js should pass jshint.'); 
  });

});
define('dine/tests/services/dfp.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/dfp.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(false, 'services/dfp.js should pass jshint.\nservices/dfp.js: line 133, col 37, Expected \'===\' and instead saw \'==\'.\n\n1 error'); 
  });

});
define('dine/tests/test-helper', ['dine/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('dine/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('dine/tests/unit/controllers/city/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:city/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('dine/tests/unit/controllers/city/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers/city');
  QUnit.test('unit/controllers/city/index-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/city/index-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/controllers/city/neighborhood-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:city/neighborhood', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('dine/tests/unit/controllers/city/neighborhood-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers/city');
  QUnit.test('unit/controllers/city/neighborhood-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/city/neighborhood-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/controllers/city/restaurants-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:city/restaurants', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('dine/tests/unit/controllers/city/restaurants-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers/city');
  QUnit.test('unit/controllers/city/restaurants-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/city/restaurants-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/controllers/city/restaurants-with-features-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:city/restaurants-with-features', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('dine/tests/unit/controllers/city/restaurants-with-features-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers/city');
  QUnit.test('unit/controllers/city/restaurants-with-features-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/city/restaurants-with-features-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/controllers/city-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:city', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('dine/tests/unit/controllers/city-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/city-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/controllers/city-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/helpers/is-equal-test', ['dine/helpers/is-equal', 'qunit'], function (is_equal, qunit) {

  'use strict';

  qunit.module('Unit | Helper | is equal');

  qunit.test('it works', function (assert) {
    var result = is_equal.isEqual(42, 42);
    assert.ok(result);
  });

  qunit.test('it fails', function (assert) {
    var result = is_equal.isEqual(24, 42);
    assert.notOk(result);
  });

});
define('dine/tests/unit/helpers/is-equal-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/helpers');
  QUnit.test('unit/helpers/is-equal-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/helpers/is-equal-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/initializers/component-router-injector-test', ['ember', 'dine/initializers/component-router-injector', 'qunit'], function (Ember, component_router_injector, qunit) {

  'use strict';

  var registry, application;

  qunit.module('Unit | Initializer | component router injector', {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    component_router_injector.initialize(registry, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('dine/tests/unit/initializers/component-router-injector-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/initializers');
  QUnit.test('unit/initializers/component-router-injector-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/initializers/component-router-injector-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/initializers/constants-test', ['ember', 'dine/initializers/constants', 'qunit'], function (Ember, constants, qunit) {

  'use strict';

  var registry, application;

  qunit.module('Unit | Initializer | constants', {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    constants.initialize(registry, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('dine/tests/unit/initializers/constants-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/initializers');
  QUnit.test('unit/initializers/constants-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/initializers/constants-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/initializers/dfp-test', ['ember', 'dine/initializers/dfp', 'qunit'], function (Ember, dfp, qunit) {

  'use strict';

  var registry, application;

  qunit.module('Unit | Initializer | dfp', {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    dfp.initialize(registry, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('dine/tests/unit/initializers/dfp-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/initializers');
  QUnit.test('unit/initializers/dfp-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/initializers/dfp-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/initializers/init-test', ['ember', 'dine/initializers/init', 'qunit'], function (Ember, init, qunit) {

  'use strict';

  var registry, application;

  qunit.module('Unit | Initializer | init', {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    init.initialize(registry, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('dine/tests/unit/initializers/init-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/initializers');
  QUnit.test('unit/initializers/init-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/initializers/init-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/initializers/overrides-test', ['ember', 'dine/initializers/overrides', 'qunit'], function (Ember, overrides, qunit) {

  'use strict';

  var registry, application;

  qunit.module('Unit | Initializer | overrides', {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    overrides.initialize(registry, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('dine/tests/unit/initializers/overrides-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/initializers');
  QUnit.test('unit/initializers/overrides-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/initializers/overrides-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/collections/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/collections/index', 'Unit | Route | city/collections/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/collections/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city/collections');
  QUnit.test('unit/routes/city/collections/index-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/collections/index-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/collections/restaurants/restaurant-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/collections/restaurants/restaurant', 'Unit | Route | city/collections/restaurants/restaurant', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/collections/restaurants/restaurant-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city/collections/restaurants');
  QUnit.test('unit/routes/city/collections/restaurants/restaurant-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/collections/restaurants/restaurant-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/collections/restaurants-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/collections/restaurants', 'Unit | Route | city/collections/restaurants', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/collections/restaurants-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city/collections');
  QUnit.test('unit/routes/city/collections/restaurants-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/collections/restaurants-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/collections-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/collections', 'Unit | Route | city/collections', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/collections-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city');
  QUnit.test('unit/routes/city/collections-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/collections-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/index', 'Unit | Route | city/index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city');
  QUnit.test('unit/routes/city/index-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/index-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/neighborhood-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/neighborhood', 'Unit | Route | city/neighborhood', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/neighborhood-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city');
  QUnit.test('unit/routes/city/neighborhood-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/neighborhood-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/restaurant-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/restaurant', 'Unit | Route | city/restaurant', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/restaurant-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city');
  QUnit.test('unit/routes/city/restaurant-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/restaurant-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city/restaurants-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city/restaurants', 'Unit | Route | city/restaurants', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city/restaurants-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes/city');
  QUnit.test('unit/routes/city/restaurants-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city/restaurants-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/routes/city-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:city', 'Unit | Route | city', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('dine/tests/unit/routes/city-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/city-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/routes/city-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/services/api-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:api', 'Unit | Service | api', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('dine/tests/unit/services/api-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/api-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/api-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/services/branch-metrics-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:branch-metrics', 'Unit | Service | branch metrics', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('dine/tests/unit/services/branch-metrics-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/branch-metrics-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/branch-metrics-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/services/city-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:city', 'Unit | Service | city', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('dine/tests/unit/services/city-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/city-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/city-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/services/constants-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:constants', 'Unit | Service | constants', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('dine/tests/unit/services/constants-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/constants-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/constants-test.js should pass jshint.'); 
  });

});
define('dine/tests/unit/services/dfp-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:dfp', 'Unit | Service | dfp', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('dine/tests/unit/services/dfp-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/dfp-test.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'unit/services/dfp-test.js should pass jshint.'); 
  });

});
define('dine/tests/utils/common-utils.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/common-utils.js should pass jshint', function(assert) { 
    assert.expect(1);
    assert.ok(true, 'utils/common-utils.js should pass jshint.'); 
  });

});
define('dine/utils/common-utils', ['exports'], function (exports) {

    'use strict';

    exports['default'] = {
        isMobile: function isMobile() {
            var a = navigator.userAgent || navigator.vendor || window.opera;
            var isMobile = /android.+mobile|avantgo|bada\/|blackberry|bb.+mobile|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
            return isMobile;
        },
        isAndroid: function isAndroid() {
            //    var isiPad = /ipad/i.test(navigator.userAgent.toLowerCase());
            //    var isiPhone = /iphone/i.test(navigator.userAgent.toLowerCase());
            //    var isiPod = /ipod/i.test(navigator.userAgent.toLowerCase());
            //    var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
            //    var isBlackBerry = /blackberry/i.test(navigator.userAgent.toLowerCase());
            //    var isWebOS = /webos/i.test(navigator.userAgent.toLowerCase());
            //    var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());
            var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
            return isAndroid;
        },
        scrollToElem: function scrollToElem($elem, containerSelector, duration) {
            containerSelector = containerSelector ? containerSelector : "body,html";
            $(containerSelector).stop(true, false);
            $(containerSelector).animate({
                scrollTop: $elem.offset().top
            }, duration ? duration : 700);
        }
    };

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('dine/config/environment', ['ember'], function(Ember) {
  var prefix = 'dine';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dine/tests/test-helper");
} else {
  require("dine/app")["default"].create({"LOG_TRANSITIONS":true,"GOOGLE":{"API_KEY":"AIzaSyC_yRFd9HUL_NhnFR9RGIv2zmaYyyp0InA"},"Algolia":{"applicationId":"PPJGQ1WTTV","searchOnlyAPIKey":"2a1efed0f85fe8716c6cf5fd292f55f7"},"API_URL":"http://dine-api-staging.herokuapp.com/api","BRANCH_METRICS_KEY":"key_live_mhojXX163isZfyDAYX9MAphagagF8RoY","name":"dine","version":"0.0.0+f8ca7f64"});
}

/* jshint ignore:end */
//# sourceMappingURL=dine.map