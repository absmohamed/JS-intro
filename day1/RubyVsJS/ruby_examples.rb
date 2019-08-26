# Variable declaration and assignment in ruby
country = "Australia"
city = "Brisbane"
state = "Queensland"

# Printing to screen
puts state
p city
print country

# String Interpolation
puts "I live in #{city} in the state of #{state}"

# Data Structures in Ruby  (Hashes)
must_visit_australia = [{state1: "Victoria", place1: "Great Ocean Road"},
                        {state2: "Queensland", place2: "Great Barrier Reef"}]
puts (must_visit_australia)
a = must_visit_australia[0][:place1]
b = must_visit_australia[0][:state1]
puts ("I would love to visit #{a} in #{b}")