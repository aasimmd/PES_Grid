pragma solidity ^0.5.0;

contract PesGrid
{
	uint public total = 10;
	uint public consumed = 0;
	uint public sold = 0;
	uint public available = total-(sold+consumed);
	uint public buyer_count = 0;
	
	struct buyer
	{
		uint power;
		string name;
	}
	
	mapping(uint => buyer) public buyers;
	
	function addbuyer(string memory _name, uint _power) public
	{	
		sold += _power;
		available -= _power;
		buyer_count++;
		buyers[buyer_count] = buyer(_power, _name);
	}
	
	function addconsumption(uint _amount) public
	{
		consumed += _amount;
		available -= _amount;
	}
	
	function addpanels(uint _eamount) public
	{
		total += _eamount;
		available += _eamount;
	}

}