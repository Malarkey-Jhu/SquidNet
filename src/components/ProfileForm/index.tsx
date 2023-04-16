import React, { RefObject } from 'react';
import { Button, Form, Select } from '@douyinfe/semi-ui';
import { User } from '@prisma/client';

const ProfileForm = React.forwardRef<Form<any>, { user: User | null | undefined }>((props, ref) => {
  if (!props.user) return <>user not found</>;
  const curUser = props.user;

  console.log(curUser, 'curUser');
  return (
    <Form
      labelPosition='left'
      labelWidth='180px'
      labelAlign='left'
      style={{ padding: '10px', width: 600, color: 'white' }}
      labelCol={{ span: 6 }}
      ref={ref}
      initValues={{
        name: curUser.name,
        country: curUser.country,
        nscode: curUser.nscode,
        showNsCode: curUser.showNsCode,
        gender: curUser.gender,
        intro: curUser.intro,
      }}
    >
      <Form.Input
        field='name'
        label='Name'
        maxLength={30}
        rules={[
          { required: true, message: 'required error' },
          { type: 'string', message: 'type error' },
          // { validator: (rule, value) => value === 'semi', message: 'should be semi' },
        ]}
      />
      <Form.Input
        field='country'
        label='Country'
        maxLength={30}
        rules={
          [
            // { required: true, message: 'required error' },
            // { type: 'string', message: 'type error' },
            // { validator: (rule, value) => value === 'semi', message: 'should be semi' },
          ]
        }
      />
      <Form.Input
        field='nscode'
        label='Switch Code'
        rules={
          [
            // { required: true, message: 'required error' },
            // { type: 'string', message: 'type error' },
            // { validator: (rule, value) => value === 'semi', message: 'should be semi' },
          ]
        }
      />
      <Form.Switch label='Show Switch Code' field='showNsCode' />
      {/* <Form.Select label='姓名' field='name' style={{ width: 200 }}>
        <Form.Select.Option value='mike'>mike</Form.Select.Option>
        <Form.Select.Option value='jane'>jane</Form.Select.Option>
        <Form.Select.Option value='kate'>kate</Form.Select.Option>
      </Form.Select> */}
      {/* <Form.CheckboxGroup label='角色' field='role' direction='horizontal'>
        <Form.Checkbox value='admin'>admin</Form.Checkbox>
        <Form.Checkbox value='user'>user</Form.Checkbox>
        <Form.Checkbox value='guest'>guest</Form.Checkbox>
        <Form.Checkbox value='root'>root</Form.Checkbox>
      </Form.CheckboxGroup> */}
      <Form.RadioGroup label='Gender' field='gender'>
        <Form.Radio value={0}>no (hidden)</Form.Radio>
        <Form.Radio value={1}>man</Form.Radio>
        <Form.Radio value={2}>woman</Form.Radio>
        <Form.Radio value={3}>other</Form.Radio>
      </Form.RadioGroup>

      <Form.TextArea field='intro' label='Intro' maxCount={300} />
    </Form>
  );
});

export default ProfileForm;
