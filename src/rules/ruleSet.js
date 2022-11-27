/*
# Copyright 2022, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
import React from 'react';
import { Box, Grid,  TextField } from '@mui/material'
//import PropTypes from 'prop-types';
import Rule from '../rule.js';

function RuleSet(props) {

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="name" variant="standard" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="description" variant="standard" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="source" variant="standard" />
        </Grid>
        <Grid item xs={12}>
          <Rule />
        </Grid>
      </Grid>
    </Box>
  )
} // 

/*
RuleSet.propTypes = {
}
*/

export default RuleSet 