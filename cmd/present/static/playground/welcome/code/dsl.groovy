import groovy.transform.Field

class Person {
	String name
	Company company
	void is(String name) {
		this.name = name
	}
}

class Company {
	String name
	void is(String name) {
		this.name = name
	}
}

class Act {
	Person p
	String act
	Act(Person p, String act) {
		this.p = p
		this.act = act
	}
	void my(c) {
		println("${p.name} ${act}s ${p.company.name} very much")
	}
}

@Field int name = 0
@Field int company = 1
@Field String love = "love"
@Field String hate = "hate"

@Field Person i

Act I(act) {
	return new Act(i, act)
}

def My(own) {
	if (own == name) {
		i = new Person()
		return i
	}
	else if (own == company) {
		i.company = new Company()
		return i.company
	}
}
// START OMIT
My name is "Wenzhe Liu"
My company is "ASML"
I love my company
// STOP OMIT
