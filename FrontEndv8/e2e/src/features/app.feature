Feature: IM Viewer

  Scenario: Home Page
    Given I am on the home page
    When I do nothing
    Then I should see the title

  Scenario: Search
    Given I am on the home page
    When I search for "hospital"
    Then I should get 4 search results

  Scenario: Select search result
    Given I am on the home page
    When I search for "hospital"
    And I select search result "Hospital discharge entry"
    Then I should get 5 tree nodes

  Scenario: Select tree node
    Given I am on the home page
    When I search for "hospital"
    And I select search result "Hospital discharge entry"
    And I select tree node 3
    Then I should get concept ID "rm:EncounterEntry"
    And I should get concept name "Encounter entry"
    And I should get concept description "A record entry about an encounter, which is an interaction between a patient (or"
