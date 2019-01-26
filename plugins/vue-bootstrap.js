import Vue from "vue";

import { 
  Alert, 
  Layout,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Card,
  Modal,
  Pagination,
  Table
} from 'bootstrap-vue/es/components';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

[
  Alert,
  Layout,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Card,
  Modal,
  Pagination,
  Table
].map( component => Vue.use(component))