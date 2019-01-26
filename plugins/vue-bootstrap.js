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