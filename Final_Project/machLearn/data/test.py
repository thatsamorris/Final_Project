from uszipcode import SearchEngine
search = SearchEngine(simple_zipcode=True)
lat = 28.43180352
lng = -81.30852827
zipcode = search.by_coordinates(lat, lng, returns = 1)
print(zipcode[0].to_json())