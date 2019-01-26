import Vue from "vue";
//import { Alert, Table, Modal, Card, Button, ButtonGroup, ButtonToolbar, Pagination } from '~/node_modules/bootstrap-vue/es/components'

import Alert from "~/node_modules/bootstrap-vue/es/components/alert";
import Table from "~/node_modules/bootstrap-vue/es/components/table";
import Modal from "~/node_modules/bootstrap-vue/es/components/modal";
import Card from "~/node_modules/bootstrap-vue/es/components/card";
import Button from "~/node_modules/bootstrap-vue/es/components/button";
import ButtonGroup from "~/node_modules/bootstrap-vue/es/components/button-group";
import ButtonToolbar from "~/node_modules/bootstrap-vue/es/components/button-toolbar";
import Pagination from "~/node_modules/bootstrap-vue/es/components/pagination";

[
  Alert,
  Table,
  Modal,
  Card,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Pagination,

].map(component => Vue.use(component))