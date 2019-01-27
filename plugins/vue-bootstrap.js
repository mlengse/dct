import Vue from "vue";
//import { Alert, Table, Modal, Card, Button, ButtonGroup, ButtonToolbar, Pagination } from '~/node_modules/bootstrap-vue/es/components'

import Alert from "~/node_modules/bootstrap-vue/es/components/alert";
import Button from "~/node_modules/bootstrap-vue/es/components/button";
import ButtonGroup from "~/node_modules/bootstrap-vue/es/components/button-group";
import ButtonToolbar from "~/node_modules/bootstrap-vue/es/components/button-toolbar";
import Card from "~/node_modules/bootstrap-vue/es/components/card";
import InputGroup from "~/node_modules/bootstrap-vue/es/components/input-group";
import Layout from "~/node_modules/bootstrap-vue/es/components/layout";
import Modal from "~/node_modules/bootstrap-vue/es/components/modal";
import Pagination from "~/node_modules/bootstrap-vue/es/components/pagination";
import Table from "~/node_modules/bootstrap-vue/es/components/table";

[
  Alert,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  InputGroup,
  Layout,
  Modal,
  Pagination,
  Table,
 
].map(component => Vue.use(component))