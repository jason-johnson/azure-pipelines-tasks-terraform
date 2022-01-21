resource "azurerm_resource_group" "rg" {
  name = join(
    "-",
    ["rg", var.app-short-name, var.env-short-name, var.region],
  )
  location = var.region
}

resource "random_string" "rs" {
  length = 12
}

output "some_string" {
  sensitive = false
  value = "somestringvalue"
}

output "some_bool" {
  sensitive = false
  value = true
}

output "some_number" {
  sensitive = false
  value = 1
}

output "some_sensitive_string" {
  sensitive = true
  value = "some-string-value"
}

output "some_object" {
  sensitive = false
  value = { A = "1", B = "2", C = "3"}
}

output "some_tuple" {
  sensitive = false
  value = ["1", 2, "3"]
}

output "some_map" {
  sensitive = false
  value = { "A" : 1, "B" : 2, "C" : 3 }
}