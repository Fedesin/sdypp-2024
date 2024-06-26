variable "credentials_file_path" {
  type    = string
  default = "credentials.json"
}

variable "project_id" {
  type    = string
  default = "braided-complex-416718"
}

variable "region" {
  type    = string
  default = "us-east1"
}

variable "zone" {
  type    = string
  default = "us-east1-b"
}

variable "nodes" {
  type    = number
  default = 1
}

variable "metadata_startup_script" {
  type    = string
  default = "init.sh"
}

# variable "ssh_public_key_path" {
#   type    = string
#   default = ".keys/id_rsa_example.pub"
# }
