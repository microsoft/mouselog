import React from "react";
import { Checkbox } from 'antd'

const CheckboxGroup = Checkbox.Group;

class EventSelectionCheckBox extends React.Component {
	constructor(props) {
		super(props)
		
		this.plainOptions = props.allCheckedList;
		
		this.state = {
				checkedList: props.defaultCheckedList,
				indeterminate: true,
				checkAll: false,
		};
		// this.setState({
		// 	indeterminate: 
		// 		!!this.state.checkedList.length 
		// 		&& this.state.checkedList.length < this.plainOptions.length
		// })
	}

	onChange = checkedList => {
		this.setState({
			checkedList,
			indeterminate: !!checkedList.length && checkedList.length < this.plainOptions.length,
			checkAll: checkedList.length === this.plainOptions.length,
		});
		this.props.onCheckedListChange(checkedList);
	}

	onCheckAllChange = e => {
		this.setState({
			checkedList: e.target.checked ? this.plainOptions : [],
			indeterminate: false,
			checkAll: e.target.checked,
		})
		// You cannot call this.state.checkedList directly because setState is asychronous
		this.props.onCheckedListChange(e.target.checked ? this.plainOptions : []);
	}
	
	render() {
		return (
			<div>
				Select Javascripts Events
				<br />
				<CheckboxGroup
					options={this.plainOptions}
					value={this.state.checkedList}
					onChange={this.onChange}
				/> 
				<br />
				<Checkbox
							indeterminate={this.state.indeterminate}
							onChange={this.onCheckAllChange}
							checked={this.state.checkAll}
					>
							Check all
				</Checkbox>
			</div>
		)
	}
}
export default EventSelectionCheckBox;